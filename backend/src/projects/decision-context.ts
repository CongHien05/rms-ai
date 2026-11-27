import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { isUUID } from 'class-validator';
import { isAvailabilityWeekStart } from '../employees/availability-week.js';
import { decimalFromNumber, parseDecimalHours, parsePositiveSupport, projectHoursNumber } from '../employees/decimal-hours.js';
import { remainingSemantics } from './decisions/decision-availability-evidence.entity.js';
import type { SimulationSnapshotExact } from './dto/resource-simulation.dto.js';
import { calculateExactImpact, calculateSimulationImpact } from './project-hours.js';
import type { DecisionImpact, DecisionSnapshot } from './decisions/pm-decision.entity.js';

type SimulationResult = { snapshot: DecisionSnapshot; expectedImpact: DecisionImpact; snapshotExact?: SimulationSnapshotExact };
type DecisionClaims = SimulationResult & { simulationId: string; projectId: string; pmAccountId: string };
export type DecisionEvidence = { simulationId: string; simulationToken: string };
export const decisionTokenPattern = /^(v1|v2)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{43})$/;
export const maxDecisionTokenLength = 4096;

function decodeCanonical(value: string): Buffer | null {
  const decoded = Buffer.from(value, 'base64url');
  return decoded.toString('base64url') === value ? decoded : null;
}

export function decisionKey(): Buffer | null {
  const encoded = process.env.WHAT_IF_DECISION_SIGNING_KEY;
  if (!encoded || encoded === process.env.WHAT_IF_CONTEXT_SECRET || !/^[A-Za-z0-9_-]{43}$/.test(encoded)) return null;
  const key = decodeCanonical(encoded);
  return key?.length === 32 ? key : null;
}

function sign(key: Buffer, version: string, payload: string) {
  return createHmac('sha256', key).update(`rms-ai/what-if/decision/${version}:` + payload, 'ascii').digest();
}

export function issueDecisionEvidence(key: Buffer, pmAccountId: string, result: SimulationResult): DecisionEvidence {
  const simulationId = randomUUID();
  const version = result.snapshotExact ? 'v2' : 'v1';
  const claims = {
    simulationId, projectId: result.snapshot.projectId, pmAccountId,
    snapshot: result.snapshot, expectedImpact: result.expectedImpact,
    ...(result.snapshotExact && { snapshotExact: result.snapshotExact, availabilityBasis: remainingSemantics }),
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const simulationToken = `${version}.${payload}.${sign(key, version, payload).toString('base64url')}`;
  if (simulationToken.length > maxDecisionTokenLength) throw new RangeError('Decision evidence too long.');
  return { simulationId, simulationToken };
}

function exactObject<K extends string>(value: unknown, keys: readonly K[]): value is Record<K, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function validClaims(value: unknown, version: string): value is DecisionClaims {
  const keys = ['simulationId', 'projectId', 'pmAccountId', 'snapshot', 'expectedImpact'] as const;
  const allKeys = version === 'v2' ? [...keys, 'snapshotExact', 'availabilityBasis'] as const : keys;
  if (!exactObject(value, allKeys) ||
      !isUUID(value.simulationId, '4') || !isUUID(value.projectId) || !isUUID(value.pmAccountId)) return false;
  const { snapshot, expectedImpact } = value;
  if (!exactObject(snapshot, ['projectId', 'employeeId', 'skillId', 'weekStart', 'requiredHours', 'supportHours', 'availableHours']) ||
      snapshot.projectId !== value.projectId || !isUUID(snapshot.employeeId) || !isUUID(snapshot.skillId) ||
      typeof snapshot.weekStart !== 'string' || !isAvailabilityWeekStart(snapshot.weekStart)) return false;
  const { requiredHours, supportHours, availableHours } = snapshot;
  if (typeof requiredHours !== 'number' || typeof supportHours !== 'number' || typeof availableHours !== 'number' ||
      ![requiredHours, supportHours, availableHours].every(Number.isFinite) ||
      requiredHours <= 0 || supportHours < 0 || supportHours > availableHours) return false;
  if (!exactObject(expectedImpact, ['hypotheticalSupportHours', 'remainingRequiredHours', 'remainingAvailableHours'])) return false;
  let impact: DecisionImpact | null;
  if (version === 'v2') {
    if (!('availabilityBasis' in value) || value.availabilityBasis !== remainingSemantics ||
        !('snapshotExact' in value) || !exactObject(value.snapshotExact, ['availableHoursExact', 'supportHoursExact'])) return false;
    const available = parseDecimalHours(value.snapshotExact.availableHoursExact);
    const support = parsePositiveSupport(value.snapshotExact.supportHoursExact);
    if (!available || !support || available.coefficient < 0n ||
        projectHoursNumber(available, true) !== availableHours || projectHoursNumber(support, true) !== supportHours) return false;
    impact = calculateExactImpact(decimalFromNumber(requiredHours), support, available)?.numeric ?? null;
  } else {
    if (supportHours <= 0) return false;
    impact = calculateSimulationImpact(requiredHours, supportHours, availableHours);
  }
  return impact !== null && Object.entries(impact).every(([key, hours]) =>
    Number.isFinite(hours) && expectedImpact[key as keyof DecisionImpact] === hours);
}

export function verifyDecisionEvidence(key: Buffer, token: string): DecisionClaims | null {
  if (token.length > maxDecisionTokenLength) return null;
  const frame = decisionTokenPattern.exec(token);
  if (!frame || frame[0] !== token) return null;
  const [, version, encoded, mac] = frame;
  const sig = decodeCanonical(mac);
  if (!sig || sig.length !== 32 || !timingSafeEqual(sig, sign(key, version, encoded))) return null;
  const bytes = decodeCanonical(encoded);
  if (!bytes) return null;
  try {
    const claims: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    return validClaims(claims, version) ? claims : null;
  } catch {
    return null;
  }
}

export function decisionReferenceDigest(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function matchesDecisionReference(token: string, digest: string): boolean {
  return /^[a-f0-9]{64}$/.test(digest) && timingSafeEqual(
    Buffer.from(decisionReferenceDigest(token), 'hex'), Buffer.from(digest, 'hex'),
  );
}

import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { isUUID } from 'class-validator';
import { isAvailabilityWeekStart } from '../employees/availability-week.js';
import { calculateSimulationImpact } from './project-hours.js';
import type { DecisionImpact, DecisionSnapshot } from './decisions/pm-decision.entity.js';

type SimulationResult = { snapshot: DecisionSnapshot; expectedImpact: DecisionImpact };
type DecisionClaims = SimulationResult & { simulationId: string; projectId: string; pmAccountId: string };
export type DecisionEvidence = { simulationId: string; simulationToken: string };
export const decisionTokenPattern = /^v1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]{43})$/;
export const maxDecisionTokenLength = 4096;
const domain = 'rms-ai/what-if/decision/v1:';

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

function sign(key: Buffer, payload: string) {
  return createHmac('sha256', key).update(domain + payload, 'ascii').digest();
}

export function issueDecisionEvidence(key: Buffer, pmAccountId: string, result: SimulationResult): DecisionEvidence {
  const simulationId = randomUUID();
  const claims: DecisionClaims = {
    simulationId, projectId: result.snapshot.projectId, pmAccountId,
    snapshot: result.snapshot, expectedImpact: result.expectedImpact,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return { simulationId, simulationToken: `v1.${payload}.${sign(key, payload).toString('base64url')}` };
}

function exactObject<K extends string>(value: unknown, keys: readonly K[]): value is Record<K, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function validClaims(value: unknown): value is DecisionClaims {
  if (!exactObject(value, ['simulationId', 'projectId', 'pmAccountId', 'snapshot', 'expectedImpact']) ||
      !isUUID(value.simulationId, '4') || !isUUID(value.projectId) || !isUUID(value.pmAccountId)) return false;
  const { snapshot, expectedImpact } = value;
  if (!exactObject(snapshot, ['projectId', 'employeeId', 'skillId', 'weekStart', 'requiredHours', 'supportHours', 'availableHours']) ||
      snapshot.projectId !== value.projectId || !isUUID(snapshot.employeeId) || !isUUID(snapshot.skillId) ||
      typeof snapshot.weekStart !== 'string' || !isAvailabilityWeekStart(snapshot.weekStart)) return false;
  const { requiredHours, supportHours, availableHours } = snapshot;
  if (typeof requiredHours !== 'number' || typeof supportHours !== 'number' || typeof availableHours !== 'number' ||
      ![requiredHours, supportHours, availableHours].every(Number.isFinite) ||
      requiredHours <= 0 || supportHours <= 0 || supportHours > availableHours) return false;
  if (!exactObject(expectedImpact, ['hypotheticalSupportHours', 'remainingRequiredHours', 'remainingAvailableHours'])) return false;
  const impact = calculateSimulationImpact(requiredHours, supportHours, availableHours);
  return impact !== null && Object.entries(impact).every(([key, hours]) =>
    Number.isFinite(hours) && expectedImpact[key as keyof DecisionImpact] === hours);
}

export function verifyDecisionEvidence(key: Buffer, token: string): DecisionClaims | null {
  if (token.length > maxDecisionTokenLength) return null;
  const frame = decisionTokenPattern.exec(token);
  if (!frame || frame[0] !== token) return null;
  const [, encoded, mac] = frame;
  const sig = decodeCanonical(mac);
  if (!sig || sig.length !== 32 || !timingSafeEqual(sig, sign(key, encoded))) return null;
  const bytes = decodeCanonical(encoded);
  if (!bytes) return null;
  try {
    const claims: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    return validClaims(claims) ? claims : null;
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

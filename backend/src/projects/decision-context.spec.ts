import { randomUUID } from 'node:crypto';
import { decimalFromNumber, decimalText, projectHoursNumber, subtractHours } from '../employees/decimal-hours.js';
import { calculateExactImpact } from './project-hours.js';
import { decisionKey, issueDecisionEvidence, verifyDecisionEvidence } from './decision-context.js';

const projectId = randomUUID();
const pmAccountId = randomUUID();
const result = {
  snapshot: { projectId, employeeId: randomUUID(), skillId: randomUUID(),
    weekStart: '2026-11-16', requiredHours: 0.3, supportHours: 0.1, availableHours: 0.2 },
  expectedImpact: { hypotheticalSupportHours: 0.1, remainingRequiredHours: 0.2, remainingAvailableHours: 0.1 },
};

afterEach(() => vi.unstubAllEnvs());

it('round-trips a maximum-width v2 proof within 4 KiB and binds its semantic version', () => {
  const key = Buffer.alloc(32, 26);
  const support = decimalFromNumber(Number.MIN_VALUE);
  const required = decimalFromNumber(Number.MAX_VALUE);
  const available = subtractHours(required, support);
  const snapshotExact = { supportHoursExact: decimalText(support), availableHoursExact: decimalText(available) };
  const signed = {
    snapshot: { ...result.snapshot, requiredHours: Number.MAX_VALUE,
      supportHours: Number.MIN_VALUE, availableHours: projectHoursNumber(available) },
    expectedImpact: calculateExactImpact(required, support, available)!.numeric, snapshotExact,
  };
  const evidence = issueDecisionEvidence(key, pmAccountId, signed);
  expect(evidence.simulationToken).toMatch(/^v2\./);
  expect(Buffer.byteLength(evidence.simulationToken)).toBeLessThanOrEqual(4096);
  expect(verifyDecisionEvidence(key, evidence.simulationToken)).toMatchObject({
    ...signed, pmAccountId, projectId, availabilityBasis: 'remaining-v1',
  });
  expect(verifyDecisionEvidence(key, evidence.simulationToken.replace(/^v2\./, 'v1.'))).toBeNull();
});

it('issues distinct server identities and preserves the verified simulation after restart with the same key', () => {
  const key = Buffer.alloc(32, 17);
  const first = issueDecisionEvidence(key, pmAccountId, result);
  const second = issueDecisionEvidence(key, pmAccountId, result);
  expect(first.simulationId).not.toBe(second.simulationId);
  expect(verifyDecisionEvidence(Buffer.from(key), first.simulationToken)).toEqual({
    simulationId: first.simulationId, projectId, pmAccountId, ...result,
  });
});

it('rejects a changed payload, changed key, malformed frame and signed invalid snapshot', () => {
  const key = Buffer.alloc(32, 17);
  const evidence = issueDecisionEvidence(key, pmAccountId, result);
  const [, payload, mac] = evidence.simulationToken.split('.');
  const edited = Buffer.from(JSON.stringify({ ...result, projectId: randomUUID() })).toString('base64url');
  for (const token of [`v1.${edited}.${mac}`, `v1.${payload}=.${mac}`, `${evidence.simulationToken}\n`, 'v1.' + 'a'.repeat(5000)]) {
    expect(verifyDecisionEvidence(key, token)).toBeNull();
  }
  expect(verifyDecisionEvidence(Buffer.alloc(32, 18), evidence.simulationToken)).toBeNull();
  const invalid = issueDecisionEvidence(key, pmAccountId, { ...result, snapshot: { ...result.snapshot, supportHours: 1 } });
  expect(verifyDecisionEvidence(key, invalid.simulationToken)).toBeNull();
});

it('requires a canonical key distinct from the recommendation key', () => {
  const value = Buffer.alloc(32, 17).toString('base64url');
  vi.stubEnv('WHAT_IF_DECISION_SIGNING_KEY', undefined);
  expect(decisionKey()).toBeNull();
  vi.stubEnv('WHAT_IF_DECISION_SIGNING_KEY', value + '=');
  expect(decisionKey()).toBeNull();
  vi.stubEnv('WHAT_IF_DECISION_SIGNING_KEY', value);
  vi.stubEnv('WHAT_IF_CONTEXT_SECRET', value);
  expect(decisionKey()).toBeNull();
  vi.stubEnv('WHAT_IF_CONTEXT_SECRET', Buffer.alloc(32, 18).toString('base64url'));
  expect(decisionKey()?.toString('base64url')).toBe(value);
});

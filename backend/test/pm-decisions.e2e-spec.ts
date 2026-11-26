import { randomUUID } from 'node:crypto';
import { pmDecisionFixture } from './pm-decision-fixture.js';
import { devId, hrId, pmId, secondPmId, testOrigin } from './auth-test-fixtures.js';
import { issueRecommendationProof, simulationReference } from '../src/projects/recommendation-context.js';

let fixture: Awaited<ReturnType<typeof pmDecisionFixture>>;
beforeEach(async () => { fixture = await pmDecisionFixture(); });
afterEach(async () => { await fixture.app.close(); vi.unstubAllEnvs(); });

it.each(['ACCEPT', 'REJECT'] as const)('stores %s with server attribution and no source mutation', async (choice) => {
  const input = fixture.decide(choice);
  const saved = await fixture.send(input).expect('Cache-Control', 'no-store').expect(201);
  expect(saved.body).toMatchObject({ simulationId: input.simulationId, projectId: fixture.projectId, pmAccountId: pmId,
    decision: choice, snapshot: { availableHours: 3 }, expectedImpact: { remainingAvailableHours: 2 } });
  expect(Date.parse(saved.body.decidedAt)).toBeGreaterThan(0);
  expect(saved.body).not.toHaveProperty('referenceDigest');
  expect(saved.body).not.toHaveProperty('simulationToken');
  expect(fixture.rows).toHaveLength(1);
  expect(fixture.employee.availableHours).toBe(3);
  expect(fixture.source.linked).toBe(true);
});

it('checks authentication, role, Project scope, Origin and expiry before writing', async () => {
  const input = fixture.decide();
  await fixture.client.post(fixture.path()).set('Origin', testOrigin).send(input).expect(401);
  await fixture.send(input, hrId).expect(403);
  await fixture.send(input, devId).expect(403);
  await fixture.send(input, secondPmId).expect(403);
  await fixture.send(input, pmId, fixture.unmapped).expect(403);
  await fixture.send(input, pmId, fixture.projectId, 'https://example.invalid').expect(403);
  for (const session of fixture.sessions.values()) session.expiresAt = new Date(0);
  await fixture.send(input).expect(401);
  expect(fixture.rows).toHaveLength(0);
});

it('rejects tampered token, cross-Project evidence, a candidate proof and all self-asserted fields', async () => {
  const input = fixture.decide();
  const [version, payload, mac] = input.simulationToken.split('.');
  await fixture.send({ ...input, simulationToken: `${version}.${payload}A.${mac}` }).expect(400);
  await fixture.send({ ...input, simulationId: randomUUID() }).expect(400);
  const candidate = {
    projectId: fixture.projectId, employeeId: fixture.employee.id, skillId: randomUUID(),
    requiredHours: 3, weekStart: fixture.employee.availabilityWeekStart,
  };
  const recommendationKey = Buffer.alloc(32, 20);
  vi.stubEnv('WHAT_IF_CONTEXT_SECRET', recommendationKey.toString('base64url'));
  for (const value of [issueRecommendationProof(recommendationKey, candidate), simulationReference(candidate, 1), randomUUID()]) {
    await fixture.send({ ...input, simulationToken: value }).expect(400);
  }
  await fixture.send({ ...fixture.evidence(secondPmId), decision: 'REJECT' }).expect(403);
  await fixture.send({ ...fixture.evidence(pmId, fixture.otherProject), decision: 'ACCEPT' }).expect(403);
  for (const field of ['reason', 'accountId', 'role', 'snapshot', 'expectedImpact']) {
    await fixture.send({ ...input, [field]: 'client value' }).expect(400);
  }
  expect(fixture.rows).toHaveLength(0);
});

it('reads current week, availability and Skill for new decisions, and accepts restored values', async () => {
  const input = fixture.decide();
  fixture.employee.availableHours = 2;
  await fixture.send(input).expect(409).expect(({ body }) => expect(body.code).toBe('STALE_SIMULATION'));
  fixture.employee.availableHours = 3;
  fixture.employee.availabilityWeekStart = '2026-11-23';
  await fixture.send(input).expect(409);
  fixture.employee.availabilityWeekStart = '2026-11-16';
  fixture.source.linked = false;
  await fixture.send(input).expect(409);
  fixture.source.linked = true;
  await fixture.send(input).expect(201);
});

it.each([false, true])('has one record when submissions race, opposing=%s', async (opposite) => {
  const input = fixture.decide();
  const responses = await Promise.all([
    fixture.send(input), fixture.send({ ...input, decision: opposite ? 'REJECT' : 'ACCEPT' }),
  ]);
  expect(responses.map((entry) => entry.status).sort()).toEqual(opposite ? [201, 409] : [200, 201]);
  expect(fixture.rows).toHaveLength(1);
});

it('handles lost response and retries after a stale source or signing-key change', async () => {
  const input = fixture.decide();
  const original = await fixture.send(input).expect(201);
  fixture.employee.availableHours = 1;
  vi.stubEnv('WHAT_IF_DECISION_SIGNING_KEY', undefined);
  await fixture.send(input).expect(200, original.body);
  await fixture.send({ ...input, decision: 'REJECT' }).expect(409);
  await fixture.send(fixture.decide()).expect(503);
  await fixture.send({ ...input, simulationToken: input.simulationToken + 'X' }).expect(400);
  await fixture.send(input, secondPmId).expect(403);
  expect(fixture.rows).toHaveLength(1);
});

it('reconciles a MariaDB duplicate and keeps failed writes retryable', async () => {
  const input = fixture.decide();
  fixture.source.failInsert = true;
  await fixture.send(input).expect(503).expect(({ body }) => expect(body.code).toBe('DECISION_UNAVAILABLE'));
  expect(fixture.rows).toHaveLength(0);
  fixture.source.failInsert = false;
  fixture.source.mockUniqueRace = true;
  await fixture.send(input).expect(200);
  expect(fixture.rows).toHaveLength(1);
  await fixture.send(input).expect(200);
});

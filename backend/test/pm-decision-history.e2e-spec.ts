import { pmDecisionFixture } from './pm-decision-fixture.js';
import { devId, hrId, pmId, secondPmId } from './auth-test-fixtures.js';

let fixture: Awaited<ReturnType<typeof pmDecisionFixture>>;
beforeEach(async () => { fixture = await pmDecisionFixture(); });
afterEach(async () => { await fixture.app.close(); vi.unstubAllEnvs(); });

it('returns empty history, stable pagination and an explicit retryable failure', async () => {
  await fixture.read().expect(200, { items: [], hasMore: false });
  const first = (await fixture.send(fixture.decide()).expect(201)).body;
  const second = (await fixture.send(fixture.decide('REJECT')).expect(201)).body;
  const items = [first, second].sort((a, b) => b.decidedAt.localeCompare(a.decidedAt) || b.id.localeCompare(a.id))
    .map(item => ({ ...item, allocationState: 'UNAVAILABLE' }));
  await fixture.read(pmId, fixture.projectId, '?limit=1').expect(200, { items: items.slice(0, 1), hasMore: true });
  await fixture.read(pmId, fixture.projectId, '?limit=1&offset=1').expect(200, { items: items.slice(1), hasMore: false });
  for (const query of ['?limit=0', '?limit=101', '?offset=-1', '?offset=1.5', '?limit=1&limit=2', '?id=unknown']) {
    await fixture.read(pmId, fixture.projectId, query).expect(400);
  }
  fixture.source.failHistory = true;
  await fixture.read().expect(503);
  fixture.source.failHistory = false;
  await fixture.read().expect(200, { items, hasMore: false });
});

it('follows current Project ownership, preserving the original PM and denying all other actors', async () => {
  const input = fixture.decide();
  const { body: saved } = await fixture.send(input).expect(201);
  await fixture.client.get(fixture.path()).expect(401);
  await fixture.read(hrId).expect(403);
  await fixture.read(devId).expect(403);
  await fixture.read(secondPmId).expect(403);
  await fixture.read(pmId, fixture.otherProject).expect(403);
  fixture.projects.get(fixture.projectId)!.pmAccountId = secondPmId;
  await fixture.read().expect(403);
  await fixture.read(secondPmId).expect(200, { items: [{ ...saved, allocationState: 'UNAVAILABLE' }], hasMore: false });
  await fixture.send(input, secondPmId).expect(403);
});

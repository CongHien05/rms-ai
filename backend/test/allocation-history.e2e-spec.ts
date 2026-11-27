import { allocationHttpFixture } from './allocation-http-fixture.js';
import { devId, fixtureCookie, hrId, pmId, secondPmId } from './auth-test-fixtures.js';

it('keeps history project-scoped, paginated and attributed to both actors', async () => {
  const f = await allocationHttpFixture();
  const history = (id = pmId, query = '') =>
    f.client.get(`/projects/${f.projectId}/allocation-results${query}`).set('Cookie', fixtureCookie(id));
  try {
    await history().expect(200, { items: [], hasMore: false });
    for (const role of [secondPmId, hrId, devId]) await history(role).expect(403);
    f.fault.linked = false;
    await f.send().expect(409);
    f.fault.linked = true;
    f.projects.get(f.projectId)!.pmAccountId = secondPmId;
    await history().expect(403);
    await f.send(secondPmId).expect(201);
    await history(secondPmId, '?limit=1').expect(200).expect(({ body }) => {
      expect(body.hasMore).toBe(true);
      expect(body.items).toHaveLength(1);
      expect(body.items[0]).toMatchObject({
        outcome: 'APPLIED', decidedByAccountId: pmId, actorAccountId: secondPmId,
        allocation: { hoursExact: '1e0', appliedByAccountId: secondPmId },
      });
    });
    await history(secondPmId, '?limit=1&offset=1').expect(200).expect(({ body }) => {
      expect(body.hasMore).toBe(false);
      expect(body.items[0]).toMatchObject({ outcome: 'FAILED', code: 'STALE_ALLOCATION', allocation: null });
    });
    await history(secondPmId, '?limit=101').expect(400);
  } finally {
    await f.app.close();
    vi.unstubAllEnvs();
  }
});

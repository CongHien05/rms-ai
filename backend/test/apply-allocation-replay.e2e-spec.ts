import { secondPmId } from './auth-test-fixtures.js';
import { allocationHttpFixture } from './allocation-http-fixture.js';

it('rolls back both writes and reconciles unknown commit before capacity or freshness', async () => {
  const f = await allocationHttpFixture();
  try {
    f.fault.insert = true;
    await f.send().expect(503).expect(({ body }) => expect(body.code).toBe('APPLICATION_RETRYABLE'));
    await f.read().expect(200, { decisionId: f.decisionId, status: 'NOT_APPLIED', latestFailure: null });
    expect(f.allocations).toHaveLength(0);
    f.fault.insert = false;
    f.fault.commit = true;
    await f.send().expect(503).expect(({ body }) => expect(body.code).toBe('APPLICATION_UNCONFIRMED'));
    f.fault.commit = false;
    f.fault.linked = false;
    f.employee.availableHours = 0;
    const saved = (await f.read().expect(200)).body;
    await f.send().expect(200, saved);
    await f.read(secondPmId).expect(403);
    expect(f.allocations).toHaveLength(1);
    expect(f.results.map(row => row.outcome)).toEqual(['APPLIED']);
  } finally {
    await f.app.close();
    vi.unstubAllEnvs();
  }
});

it('reads the committed winner in a fresh scope after a duplicate insert', async () => {
  const f = await allocationHttpFixture();
  try {
    f.fault.duplicate = true;
    const winner = (await f.send().expect(200)).body;
    expect(winner).toMatchObject({ status: 'APPLIED', decisionId: f.decisionId });
    expect(f.allocations).toHaveLength(1);
    await f.read().expect(200, winner);
    await f.read(secondPmId).expect(403);
  } finally {
    await f.app.close();
    vi.unstubAllEnvs();
  }
});

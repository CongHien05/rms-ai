import { devId, hrId, pmId, secondPmId, testOrigin } from './auth-test-fixtures.js';
import { allocationHttpFixture } from './allocation-http-fixture.js';

it('checks Auth, Origin, Project and backend provenance before writing', async () => {
  const f = await allocationHttpFixture();
  try {
    await f.client.post(f.path).set('Origin', testOrigin).send({}).expect(401);
    for (const actor of [hrId, devId, secondPmId]) await f.send(actor).expect(403);
    await f.send(pmId, { hoursExact: '9e0' }).expect(400);
    expect(f.results).toHaveLength(0);
    f.fault.provenance = true;
    await f.send().expect(409).expect(({ body }) => expect(body.code).toBe('LEGACY_DECISION'));
    f.fault.provenance = false;
    f.fault.linked = false;
    await f.send().expect(409).expect(({ body }) => expect(body.code).toBe('STALE_ALLOCATION'));
    expect(f.allocations).toHaveLength(0);
    f.fault.linked = true;
    f.projects.get(f.projectId)!.pmAccountId = secondPmId;
    await f.send().expect(403);
    await f.send(secondPmId).expect(201).expect(({ body }) => {
      expect(body).toMatchObject({ status: 'APPLIED', decidedByAccountId: pmId, appliedByAccountId: secondPmId, hoursExact: '1e0' });
    });
    expect(f.results.map(row => row.outcome)).toEqual(['FAILED', 'FAILED', 'APPLIED']);
    expect(f.allocations).toHaveLength(1);
  } finally {
    await f.app.close();
    vi.unstubAllEnvs();
  }
});

it('distinguishes missing, zero and negative capacity without creating an allocation', async () => {
  const f = await allocationHttpFixture();
  try {
    for (const [hours, code] of [
      [null, 'AVAILABILITY_MISSING'], [0, 'INSUFFICIENT_AVAILABILITY'], [-0.1, 'AVAILABILITY_OVER_ALLOCATED'],
    ] as const) {
      Object.assign(f.employee, { availableHours: hours });
      await f.send().expect(409).expect(({ body }) => expect(body.code).toBe(code));
    }
    expect(f.allocations).toHaveLength(0);
    expect(f.results.map(row => row.outcome)).toEqual(['FAILED', 'FAILED', 'FAILED']);
  } finally {
    await f.app.close();
    vi.unstubAllEnvs();
  }
});

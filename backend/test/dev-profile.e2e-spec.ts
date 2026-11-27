import { openAuthApp } from './auth-http-fixture.js';
import { devId, firstEmployeeId, fixtureCookie, pmId, secondDevId, secondEmployeeId } from './auth-test-fixtures.js';

it('projects only the linked Employee for each DEV without accepting a caller-supplied ID', async () => {
  const { app, client } = await openAuthApp();
  try {
    await client.get('/auth/me/employee').set('Cookie', fixtureCookie(devId))
      .set('X-Role', 'HR').set('X-Employee-Id', secondEmployeeId)
      .expect(200, { employee: { id: firstEmployeeId, displayName: 'Fixture A' }, skills: [], workContext: { status: 'unavailable' } });
    await client.get('/auth/me/employee').set('Cookie', fixtureCookie(secondDevId))
      .expect(200, { employee: { id: secondEmployeeId, displayName: 'Fixture B' }, skills: [], workContext: { status: 'unavailable' } });
    await client.get('/auth/me/employee').set('Cookie', fixtureCookie(pmId)).expect(403);
    await client.get(`/auth/me/employee?employeeId=${secondEmployeeId}`).set('Cookie', fixtureCookie(devId)).expect(400);
    await client.get(`/employees/${secondEmployeeId}`).set('Cookie', fixtureCookie(devId)).expect(403);
    await client.get('/projects').set('Cookie', fixtureCookie(devId)).expect(403);
    await client.get('/employees/availability').set('Cookie', fixtureCookie(devId)).expect(403);
    await client.get(`/projects/${firstEmployeeId}/allocation-results`).set('Cookie', fixtureCookie(devId)).expect(403);
  } finally {
    await app.close();
    vi.unstubAllEnvs();
  }
});

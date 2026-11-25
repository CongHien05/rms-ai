import { openAuthApp } from './auth-http-fixture.js';
import { devId, firstEmployeeId, fixtureCookie, hrId, pmId, testOrigin } from './auth-test-fixtures.js';

it('protects the HR directory and allows only its shared Skill list to PM', async () => {
  const { app, client } = await openAuthApp();
  try {
    await client.get('/skills').set('Cookie', fixtureCookie(pmId)).expect(200, []);
    await client.get('/skills').set('Cookie', fixtureCookie(hrId)).expect(200, []);
    await client.get('/skills').set('Cookie', fixtureCookie(devId)).expect(403);
    for (const path of ['/employees','/employees/availability',`/employees/${firstEmployeeId}`,`/employees/${firstEmployeeId}/skills`,`/skills/${firstEmployeeId}`]) {
      await client.get(path).expect(401);
      await client.get(path).set('Cookie', fixtureCookie(pmId)).expect(403);
    }
    for (const path of ['/employees',`/employees/${firstEmployeeId}/skills`,'/skills']) {
      await client.post(path).set('Origin', testOrigin).set('Cookie', fixtureCookie(devId)).send({}).expect(403);
    }
    await client.get(`/employees/${firstEmployeeId}`).set('Cookie', fixtureCookie(hrId)).expect(200);
  } finally {
    await app.close();
    vi.unstubAllEnvs();
  }
});

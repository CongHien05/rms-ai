import { PasswordHasher } from '../src/auth/password.js';
import { openAuthApp } from './auth-http-fixture.js';
import { devId, fixtureCookie, hrId, pmId, testOrigin } from './auth-test-fixtures.js';

describe('Auth HTTP with real guards and repository doubles', () => {
  const password = 'fixture-only credential';
  let validHash: string;
  let harness: Awaited<ReturnType<typeof openAuthApp>>;

  beforeAll(async () => {
    validHash = await new PasswordHasher().hash(password);
  }, 20_000);

  beforeEach(async () => {
    harness = await openAuthApp();
    for (const account of harness.accounts.values()) account.passwordHash = validHash;
  });

  afterEach(async () => {
    await harness?.app.close();
    vi.unstubAllEnvs();
  });

  it.each([pmId, hrId, devId])('authenticates each role and reloads its server identity', async (id) => {
    const account = harness.accounts.get(id)!;
    const login = await harness.client.post('/auth/login').set('Origin', testOrigin)
      .send({ email: account.email.toUpperCase(), password }).expect(200);
    expect(login.body).toEqual({ accountId: id, role: account.role });
    const cookie = login.get('Set-Cookie')![0];
    expect(cookie).toContain('Max-Age=28800');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).not.toMatch(/Secure|Domain=/);
    const token = cookie.split(';')[0].split('=')[1];
    expect(JSON.stringify([...harness.sessions.values()].map(it => it.tokenDigest))).not.toContain(token);
    await harness.client.get('/auth/me').set('Cookie', cookie.split(';')[0])
      .expect('Cache-Control', 'no-store').expect(200, login.body);
  }, 20_000);

  it('uses the same rejection for incorrect, unknown and disabled credentials', async () => {
    const account = harness.accounts.get(pmId)!;
    const incorrect = await harness.client.post('/auth/login').set('Origin', testOrigin)
      .send({ email: account.email, password: 'wrong fixture password' }).expect(401);
    const unknown = await harness.client.post('/auth/login').set('Origin', testOrigin)
      .send({ email: 'unknown@fixture.invalid', password }).expect(401);
    account.disabledAt = new Date();
    const disabled = await harness.client.post('/auth/login').set('Origin', testOrigin)
      .send({ email: account.email, password }).expect(401);
    expect(incorrect.body).toEqual(unknown.body);
    expect(disabled.body).toEqual(unknown.body);
    expect(disabled.get('Set-Cookie')).toBeUndefined();
  }, 20_000);

  it('rejects missing, duplicate, expired or revoked session and fails closed on repository errors', async () => {
    const cookie = fixtureCookie(pmId);
    await harness.client.get('/auth/me').expect(401);
    await harness.client.get('/auth/me').set('Cookie', `${cookie}; ${cookie}`).expect(401);
    const entry = [...harness.sessions.values()].find(item => item.accountId === pmId)!;
    entry.expiresAt = new Date(0);
    await harness.client.get('/auth/me').set('Cookie', cookie).expect(401);
    entry.expiresAt = new Date(Date.now() + 60_000);
    harness.sessionsRepository.findOne.mockRejectedValueOnce(new Error('unreachable'));
    await harness.client.get('/auth/me').set('Cookie', cookie).expect('Cache-Control', 'no-store').expect(503);
    harness.accounts.get(pmId)!.disabledAt = new Date();
    await harness.client.get('/auth/me').set('Cookie', cookie).expect(401);
  });

  it('rotates the presented cookie and logs out only its replacement', async () => {
    const old = fixtureCookie(pmId);
    const account = harness.accounts.get(pmId)!;
    const device = await harness.client.post('/auth/login').set('Origin', testOrigin)
      .send({ email: account.email, password }).expect(200);
    const replacement = await harness.client.post('/auth/login').set('Origin', testOrigin).set('Cookie', old)
      .send({ email: account.email, password }).expect(200);
    const current = replacement.get('Set-Cookie')![0].split(';')[0];
    await harness.client.get('/auth/me').set('Cookie', old).expect(401);
    const logout = await harness.client.post('/auth/logout').set('Origin', testOrigin).set('Cookie', current).expect(204);
    expect(logout.get('Set-Cookie')![0]).toContain('Max-Age=0');
    expect(logout.get('Set-Cookie')![0]).toContain('Path=/');
    await harness.client.get('/auth/me').set('Cookie', current).expect(401);
    await harness.client.get('/auth/me').set('Cookie', device.get('Set-Cookie')![0].split(';')[0]).expect(200);
  }, 20_000);

  it('checks Origin on login, logout and writes and denies an undeclared policy', async () => {
    const body = { email: harness.accounts.get(pmId)!.email, password };
    for (const origin of [undefined, 'null', 'https://elsewhere.invalid', testOrigin + '.invalid']) {
      const call = harness.client.post('/auth/login').send(body);
      if (origin) call.set('Origin', origin);
      await call.expect(403);
    }
    await harness.client.post('/auth/login').set('Origin', testOrigin)
      .set('Content-Type', 'text/plain').send('fixture').expect(415);
    await harness.client.post('/auth/logout').set('Cookie', fixtureCookie(pmId))
      .set('Origin', 'https://elsewhere.invalid').expect(403);
    await harness.client.post('/projects').set('Cookie', fixtureCookie(pmId))
      .send({ name: 'Denied' }).expect(403);
    await harness.client.get('/auth/me').set('Cookie', fixtureCookie(pmId)).expect(200);
    await harness.client.get('/test-policy').expect(401);
    await harness.client.get('/test-policy').set('Cookie', fixtureCookie(pmId)).expect(403);
  });

  it('sets the HTTPS host-only Secure cookie and rejects forged login shape', async () => {
    await harness.app.close();
    harness = await openAuthApp(true);
    const account = harness.accounts.get(pmId)!;
    account.passwordHash = validHash;
    const origin = 'https://rms.fixture.invalid';
    await harness.client.post('/auth/login').set('Origin', origin)
      .send({ email: account.email, password, role: 'HR' }).expect(400);
    const login = await harness.client.post('/auth/login').set('Origin', origin)
      .send({ email: account.email, password }).expect(200);
    expect(login.get('Set-Cookie')![0]).toMatch(/^__Host-rms_session=[^;]+;.*; Secure;/);
    expect(login.get('Set-Cookie')![0]).not.toContain('Domain=');
  }, 20_000);
});

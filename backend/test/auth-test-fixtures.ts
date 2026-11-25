import { createHash } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { AuthSession } from '../src/auth/auth-session.entity.js';
import type { AccountRole, UserAccount } from '../src/auth/user-account.entity.js';

export const testOrigin = 'http://127.0.0.1:5173';
export const pmId = '11111111-1111-4111-8111-111111111111';
export const secondPmId = '22222222-2222-4222-8222-222222222222';
export const hrId = '33333333-3333-4333-8333-333333333333';
export const devId = '44444444-4444-4444-8444-444444444444';
export const secondDevId = '55555555-5555-4555-8555-555555555555';
export const firstEmployeeId = '66666666-6666-4666-8666-666666666666';
export const secondEmployeeId = '77777777-7777-4777-8777-777777777777';
export const testRiskToken = Buffer.alloc(32, 17).toString('base64url');

export function configureAuthTestEnv() {
  vi.stubEnv('DB_HOST', 'test.invalid');
  vi.stubEnv('DB_PORT', '3306');
  vi.stubEnv('DB_USERNAME', 'test');
  vi.stubEnv('DB_PASSWORD', '');
  vi.stubEnv('DB_DATABASE', 'test_auth');
  vi.stubEnv('AUTH_MODE', 'local');
  vi.stubEnv('AUTH_FRONTEND_ORIGIN', testOrigin);
  vi.stubEnv('AUTH_TRUSTED_PROXY_IPS', '');
  vi.stubEnv('RISK_SERVICE_TOKEN', testRiskToken);
}

function cookieValue(id: string) {
  return createHash('sha256').update(id).digest('base64url');
}

export function fixtureCookie(id: string) {
  return `rms_session_dev=${cookieValue(id)}`;
}

export function createAuthFixture() {
  const accounts = new Map<string, UserAccount>();
  const sessions = new Map<string, AuthSession>();
  const add = (id: string, role: AccountRole, employeeId: string | null = null) => {
    const account: UserAccount = {
      id, email: `${role.toLowerCase()}-${id[0]}@fixture.invalid`, employeeId, role,
      disabledAt: null, passwordHash: '',
    };
    accounts.set(id, account);
    const tokenDigest = createHash('sha256').update(cookieValue(id)).digest('hex');
    sessions.set(tokenDigest, { tokenDigest, accountId: id, account, expiresAt: new Date(Date.now() + 3_600_000) });
  };
  add(pmId, 'PM');
  add(secondPmId, 'PM');
  add(hrId, 'HR');
  add(devId, 'DEV', firstEmployeeId);
  add(secondDevId, 'DEV', secondEmployeeId);
  const sessionsRepository = {
    findOne: vi.fn(async ({ where }: { where: { tokenDigest: string; expiresAt: { value: Date } } }) => {
      const session = sessions.get(where.tokenDigest);
      const account = session && accounts.get(session.accountId);
      return session && account && !account.disabledAt && session.expiresAt > where.expiresAt.value
        ? { ...session, account } : null;
    }),
    insert: vi.fn(async (entry: Omit<AuthSession, 'account'>) => {
      sessions.set(entry.tokenDigest, { ...entry, account: accounts.get(entry.accountId)! });
    }),
    delete: vi.fn(async (where: { tokenDigest?: string; accountId?: string }) => {
      let affected = 0;
      for (const [key, entry] of sessions) {
        if (key === where.tokenDigest || entry.accountId === where.accountId) {
          sessions.delete(key);
          affected += 1;
        }
      }
      return { affected };
    }),
  };
  return { accounts, sessions, sessionsRepository };
}

export function baselineRequest(app: INestApplication<App>) {
  const agent = request(app.getHttpServer());
  const send = (method: 'get' | 'post' | 'patch', path: string) => {
    const hrRoute = path.startsWith('/employees') || path.startsWith('/skills');
    return agent[method](path).set('Origin', testOrigin).set('Cookie', fixtureCookie(hrRoute ? hrId : pmId));
  };
  return {
    get: (path: string) => send('get', path),
    post: (path: string) => send('post', path),
    patch: (path: string) => send('patch', path),
  };
}

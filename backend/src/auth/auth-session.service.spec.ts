import type { DataSource } from 'typeorm';
import { AuthSessionService } from './auth-session.service.js';
import { AuthSession } from './auth-session.entity.js';
import { cookieDigest, digestToken } from './auth-session.repository.js';
import { LoginRateLimiter } from './login-rate-limiter.js';
import type { PasswordHasher } from './password.js';

it.each(['reset-password', 'disable'])('does not create a session when %s commits during password verification', async change => {
  const unlocked = { id: 'pm', role: 'PM', passwordHash: 'verified-before-lock', employeeId: null, disabledAt: null };
  const locked = change === 'disable' ? { ...unlocked, disabledAt: new Date() } : { ...unlocked, passwordHash: 'after-reset' };
  const insert = vi.fn();
  const setLock = vi.fn().mockReturnThis();
  const manager = (row: typeof unlocked | typeof locked) => ({
    getRepository: (entity: unknown) => entity === AuthSession ? { insert } : ({
      createQueryBuilder: () => ({
        addSelect: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis(), setLock,
        getOne: vi.fn(async () => row),
      }),
    }),
  });
  let allowVerify!: (value: boolean) => void;
  let verificationStarted!: () => void;
  const started = new Promise<void>(resolve => { verificationStarted = resolve; });
  const passwords = {
    verify: () => {
      verificationStarted();
      return new Promise<boolean>(resolve => { allowVerify = resolve; });
    },
  } as unknown as PasswordHasher;
  let current = unlocked;
  const db = {
    manager: manager(unlocked),
    transaction: (callback: (arg: ReturnType<typeof manager>) => unknown) => callback(manager(current)),
  } as unknown as DataSource;
  const service = new AuthSessionService(db, passwords, new LoginRateLimiter());
  const login = service.login('test@fixture.invalid', 'pass', 'source', null);
  const rejected = expect(login).rejects.toMatchObject({ status: 401 });
  await started;
  current = locked as typeof unlocked;
  allowVerify(true);
  await rejected;
  expect(setLock).toHaveBeenCalledWith('pessimistic_write');
  expect(insert).not.toHaveBeenCalled();
});

it('rejects duplicated and non-canonical session cookies', () => {
  const token = Buffer.alloc(32).toString('base64url');
  expect(cookieDigest(`other=1; rms=${token}`, 'rms')).toBe(digestToken(token));
  expect(cookieDigest(`rms=${token}; rms=${token}`, 'rms')).toBeNull();
  expect(cookieDigest('rms', 'rms')).toBeNull();
  expect(cookieDigest(`rms=${token.slice(0, -1)}B`, 'rms')).toBeNull();
});

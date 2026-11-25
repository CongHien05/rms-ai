import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { DataSource, type EntityManager } from 'typeorm';
import { AuthSession } from './auth-session.entity.js';
import { digestToken } from './auth-session.repository.js';
import { authUnavailable, unauthenticated } from './auth-policy.js';
import { LoginRateLimitError, LoginRateLimiter } from './login-rate-limiter.js';
import { PasswordHasher } from './password.js';
import { accountRoles, UserAccount } from './user-account.entity.js';

export const sessionLifetimeMs = 8 * 60 * 60 * 1000;

export function accountWithHash(manager: EntityManager) {
  return manager.getRepository(UserAccount).createQueryBuilder('account').addSelect('account.passwordHash');
}

function activeAccount(account: UserAccount | null): account is UserAccount {
  return Boolean(account && !account.disabledAt && accountRoles.includes(account.role) &&
    (account.role === 'DEV' ? account.employeeId : account.employeeId === null));
}

function invalidCredentials() {
  return new UnauthorizedException({
    statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng.',
  });
}

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly db: DataSource,
    private readonly passwords: PasswordHasher,
    private readonly limiter: LoginRateLimiter,
  ) {}

  async login(email: string, password: string, source: string, previousDigest: string | null) {
    try {
      const verified = await this.limiter.run(email, source, async () => {
        const account = await accountWithHash(this.db.manager).where('account.email = :email', { email }).getOne();
        const eligible = activeAccount(account);
        const matches = await this.passwords.verify(password, eligible ? account.passwordHash : undefined);
        if (!eligible || !matches) throw invalidCredentials();
        return account;
      });

      return await this.db.transaction(async (manager) => {
        const account = await accountWithHash(manager)
          .where('account.id = :id', { id: verified.id }).setLock('pessimistic_write').getOne();
        if (!activeAccount(account) || account.passwordHash !== verified.passwordHash) throw invalidCredentials();
        const sessions = manager.getRepository(AuthSession);
        const token = randomBytes(32).toString('base64url');
        await sessions.insert({
          tokenDigest: digestToken(token),
          accountId: account.id,
          expiresAt: new Date(Date.now() + sessionLifetimeMs),
        });
        if (previousDigest) await sessions.delete({ tokenDigest: previousDigest });
        return { token, user: { accountId: account.id, role: account.role } };
      });
    } catch (error) {
      if (error instanceof LoginRateLimitError || error instanceof UnauthorizedException) throw error;
      throw authUnavailable();
    }
  }

  async logout(tokenDigest: string): Promise<void> {
    let affected: number | null | undefined;
    try {
      const result = await this.db.getRepository(AuthSession).delete({ tokenDigest });
      affected = result.affected;
    } catch {
      throw authUnavailable();
    }
    if (!affected) throw unauthenticated();
  }
}

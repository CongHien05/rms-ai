import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'node:crypto';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { AuthSession } from './auth-session.entity.js';
import { accountRoles } from './user-account.entity.js';
import { authUnavailable, type Principal } from './auth-policy.js';

export function cookieDigest(header: string | undefined, name: string): string | null {
  if (!header) return null;
  const matches = header.split(';').map((part) => part.trim()).filter(
    (part) => part.split('=', 1)[0].trim() === name,
  );
  if (matches.length !== 1) return null;
  const separator = matches[0].indexOf('=');
  if (separator < 0) return null;
  const token = matches[0].slice(separator + 1);
  if (!/^[A-Za-z0-9_-]{43}$/.test(token) || Buffer.from(token, 'base64url').toString('base64url') !== token) return null;
  return digestToken(token);
}

export function digestToken(token: string): string {
  return createHash('sha256').update(token, 'ascii').digest('hex');
}

@Injectable()
export class AuthSessionRepository {
  constructor(@InjectRepository(AuthSession) private readonly sessions: Repository<AuthSession>) {}

  async findPrincipal(tokenDigest: string, now = new Date()): Promise<Principal | null> {
    try {
      const session = await this.sessions.findOne({
        where: { tokenDigest, expiresAt: MoreThan(now), account: { disabledAt: IsNull() } },
        relations: { account: true },
        relationLoadStrategy: 'join',
      });
      const account = session?.account;
      if (!account || account.disabledAt || !accountRoles.includes(account.role) ||
          (account.role === 'DEV' ? !account.employeeId : account.employeeId !== null)) {
        return null;
      }
      return { accountId: account.id, role: account.role, employeeId: account.employeeId, tokenDigest };
    } catch {
      throw authUnavailable();
    }
  }
}

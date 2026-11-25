import { randomUUID } from 'node:crypto';
import { isEmail, isUUID } from 'class-validator';
import { DataSource } from 'typeorm';
import { Employee } from '../employees/employee.entity.js';
import { AuthSession } from './auth-session.entity.js';
import { normalizeEmail, passwordLengthAllowed, PasswordHasher } from './password.js';
import { accountRoles, UserAccount, type AccountRole } from './user-account.entity.js';

export class OperationError extends Error {}

export class AccountOperations {
  constructor(private readonly db: DataSource, private readonly passwords = new PasswordHasher()) {}

  async issue(input: { email: string; role: string; employeeId: string | null; password: string }) {
    const email = normalizeEmail(input.email);
    const role = input.role as AccountRole;
    const employeeId = input.employeeId?.toLowerCase() ?? null;
    if (email.length > 254 || !/^[\x21-\x7e]+$/.test(email) || !isEmail(email) ||
        !accountRoles.includes(role) || (role === 'DEV' ? !employeeId || !isUUID(employeeId) : employeeId !== null)) {
      throw new OperationError('Email, vai trò hoặc liên kết Employee không hợp lệ.');
    }
    const passwordHash = await this.hashNewPassword(input.password);
    return this.db.transaction(async (manager) => {
      if (employeeId && !await manager.getRepository(Employee).existsBy({ id: employeeId })) {
        throw new OperationError('Không tìm thấy Employee đã xác minh.');
      }
      const repository = manager.getRepository(UserAccount);
      const id = randomUUID();
      await repository.insert({ id, email, role, employeeId, passwordHash, disabledAt: null });
      return id;
    });
  }

  async resetPassword(email: string, password: string) {
    const passwordHash = await this.hashNewPassword(password);
    await this.changeAccount(email, passwordHash);
  }

  async disable(email: string) {
    await this.changeAccount(email, null);
  }

  async pruneExpired() {
    const now = new Date();
    const repository = this.db.getRepository(AuthSession);
    const batch = await repository.createQueryBuilder('session')
      .select('session.tokenDigest').where('session.expiresAt <= :now', { now })
      .orderBy('session.expiresAt', 'ASC').limit(1000).getMany();
    if (!batch.length) return 0;
    const result = await repository.createQueryBuilder().delete()
      .where('tokenDigest IN (:...digests) AND expiresAt <= :now', {
        digests: batch.map((session) => session.tokenDigest), now,
      }).execute();
    return result.affected ?? 0;
  }

  private async hashNewPassword(password: string) {
    if (!passwordLengthAllowed(password, 15)) throw new OperationError('Mật khẩu phải dài 15–128 ký tự và tối đa 512 byte.');
    return this.passwords.hash(password);
  }

  private async changeAccount(email: string, newHash: string | null) {
    await this.db.transaction(async (manager) => {
      const repository = manager.getRepository(UserAccount);
      const account = await repository.findOne({
        where: { email: normalizeEmail(email) }, lock: { mode: 'pessimistic_write' },
      });
      if (!account || (newHash !== null && account.disabledAt)) {
        throw new OperationError('Không tìm thấy tài khoản phù hợp yêu cầu.');
      }
      if (newHash !== null) await repository.update(account.id, { passwordHash: newHash });
      else if (!account.disabledAt) await repository.update(account.id, { disabledAt: new Date() });
      await manager.getRepository(AuthSession).delete({ accountId: account.id });
    });
  }
}

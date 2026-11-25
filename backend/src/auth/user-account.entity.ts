import { Column, Entity, PrimaryColumn } from 'typeorm';

export const accountRoles = ['PM', 'HR', 'DEV'] as const;
export type AccountRole = (typeof accountRoles)[number];

@Entity({ name: 'user_accounts' })
export class UserAccount {
  @PrimaryColumn({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  id: string;

  @Column({ type: 'varchar', length: 254, charset: 'ascii', collation: 'ascii_bin', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, charset: 'ascii', collation: 'ascii_bin', select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: accountRoles })
  role: AccountRole;

  @Column({ type: 'varchar', length: 36, nullable: true, unique: true })
  employeeId: string | null;

  @Column({ type: 'datetime', precision: 3, nullable: true })
  disabledAt: Date | null;
}

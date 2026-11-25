import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from 'typeorm';
import { UserAccount } from './user-account.entity.js';

@Entity({ name: 'auth_sessions' })
export class AuthSession {
  @PrimaryColumn({ type: 'char', length: 64, charset: 'ascii', collation: 'ascii_bin' })
  tokenDigest: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  accountId: string;

  @ManyToOne(() => UserAccount, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'accountId' })
  account: Relation<UserAccount>;

  @Column({ type: 'datetime', precision: 3 })
  expiresAt: Date;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from 'typeorm';
import { UserAccount } from '../../auth/user-account.entity.js';
import { PMDecision } from '../decisions/pm-decision.entity.js';
import { ProjectAllocation } from './project-allocation.entity.js';

export const applicationFailureCodes = [
  'DECISION_NOT_ACCEPTED', 'LEGACY_DECISION', 'STALE_ALLOCATION',
  'AVAILABILITY_MISSING', 'INSUFFICIENT_AVAILABILITY', 'AVAILABILITY_OVER_ALLOCATED',
] as const;
export type ApplicationFailureCode = (typeof applicationFailureCodes)[number];
const applicationOutcomes = ['APPLIED', 'FAILED'] as const;

@Entity({ name: 'application_results' })
@Index('UQ_app_result_allocation', ['allocationId'], { unique: true })
@Index('IDX_app_result_decision_time', ['decisionId', 'occurredAt', 'id'])
export class ApplicationResult {
  @PrimaryColumn({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  id: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  decisionId: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  actorAccountId: string;

  @Column({ type: 'enum', enum: applicationOutcomes })
  outcome: (typeof applicationOutcomes)[number];

  @Column({ type: 'varchar', length: 40, nullable: true })
  code: ApplicationFailureCode | null;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin', nullable: true })
  allocationId: string | null;

  @Column({ type: 'datetime', precision: 3 })
  occurredAt: Date;

  @ManyToOne(() => PMDecision, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'decisionId', foreignKeyConstraintName: 'FK_app_result_decision' })
  decision: Relation<PMDecision>;

  @ManyToOne(() => UserAccount, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'actorAccountId', foreignKeyConstraintName: 'FK_app_result_actor' })
  actorAccount: Relation<UserAccount>;

  @ManyToOne(() => ProjectAllocation, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'allocationId', foreignKeyConstraintName: 'FK_app_result_allocation' })
  allocation: Relation<ProjectAllocation | null>;
}

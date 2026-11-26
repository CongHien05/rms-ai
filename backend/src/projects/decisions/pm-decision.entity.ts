import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from 'typeorm';
import { UserAccount } from '../../auth/user-account.entity.js';
import { Project } from '../project.entity.js';
import type { SimulationImpact } from '../dto/resource-simulation.dto.js';
import type { RecommendationContext } from '../recommendation-context.js';

export const decisionChoices = ['ACCEPT', 'REJECT'] as const;
export type DecisionChoice = (typeof decisionChoices)[number];
export type DecisionSnapshot = RecommendationContext & {
  supportHours: number;
  availableHours: number;
};
export type DecisionImpact = SimulationImpact;
export type DecisionResponse = Omit<PMDecision, 'referenceDigest' | 'project' | 'pmAccount'>;

@Entity({ name: 'pm_decisions' })
@Index('IDX_pm_decisions_history', ['projectId', 'decidedAt', 'id'])
@Index('UQ_pm_decisions_simulation', ['simulationId'], { unique: true })
export class PMDecision {
  @PrimaryColumn({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  id: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  simulationId: string;

  @Column({ type: 'varchar', length: 36 })
  projectId: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  pmAccountId: string;

  @Column({ type: 'enum', enum: decisionChoices })
  decision: DecisionChoice;

  @Column({ type: 'datetime', precision: 3 })
  decidedAt: Date;

  @Column({ type: 'json' })
  snapshot: DecisionSnapshot;

  @Column({ type: 'json' })
  expectedImpact: DecisionImpact;

  @Column({ type: 'char', length: 64, charset: 'ascii', collation: 'ascii_bin', select: false })
  referenceDigest: string;

  @ManyToOne(() => Project, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'projectId', foreignKeyConstraintName: 'FK_pm_decisions_project' })
  project: Relation<Project>;

  @ManyToOne(() => UserAccount, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'pmAccountId', foreignKeyConstraintName: 'FK_pm_decisions_account' })
  pmAccount: Relation<UserAccount>;
}

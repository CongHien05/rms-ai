import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from 'typeorm';
import { PMDecision } from './pm-decision.entity.js';

export const remainingSemantics = 'remaining-v1' as const;

@Entity({ name: 'decision_availability_evidence' })
export class DecisionAvailabilityEvidence {
  @PrimaryColumn({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  decisionId: string;

  @Column({ type: 'varchar', length: 24 })
  semantics: typeof remainingSemantics;

  @Column({ type: 'varchar', length: 672, charset: 'ascii', collation: 'ascii_bin' })
  availableHoursExact: string;

  @Column({ type: 'varchar', length: 672, charset: 'ascii', collation: 'ascii_bin' })
  supportHoursExact: string;

  @ManyToOne(() => PMDecision, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'decisionId', foreignKeyConstraintName: 'FK_dae_decision' })
  decision: Relation<PMDecision>;
}

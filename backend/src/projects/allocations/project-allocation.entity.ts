import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from 'typeorm';
import { UserAccount } from '../../auth/user-account.entity.js';
import { Employee } from '../../employees/employee.entity.js';
import { Skill } from '../../skills/skill.entity.js';
import { PMDecision } from '../decisions/pm-decision.entity.js';
import { Project } from '../project.entity.js';

@Entity({ name: 'project_allocations' })
@Index('UQ_alloc_decision', ['decisionId'], { unique: true })
@Index('IDX_alloc_employee_week', ['employeeId', 'weekStart'])
export class ProjectAllocation {
  @PrimaryColumn({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  id: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  decisionId: string;

  @Column({ type: 'varchar', length: 36 })
  projectId: string;

  @Column({ type: 'varchar', length: 36 })
  employeeId: string;

  @Column({ type: 'varchar', length: 36 })
  skillId: string;

  @Column({ type: 'date' })
  weekStart: string;

  @Column({ type: 'varchar', length: 672, charset: 'ascii', collation: 'ascii_bin' })
  hoursExact: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin' })
  appliedByAccountId: string;

  @Column({ type: 'datetime', precision: 3 })
  appliedAt: Date;

  @ManyToOne(() => PMDecision, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'decisionId', foreignKeyConstraintName: 'FK_alloc_decision' })
  decision: Relation<PMDecision>;

  @ManyToOne(() => Project, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'projectId', foreignKeyConstraintName: 'FK_alloc_project' })
  project: Relation<Project>;

  @ManyToOne(() => Employee, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'employeeId', foreignKeyConstraintName: 'FK_alloc_employee' })
  employee: Relation<Employee>;

  @ManyToOne(() => Skill, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'skillId', foreignKeyConstraintName: 'FK_alloc_skill' })
  skill: Relation<Skill>;

  @ManyToOne(() => UserAccount, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'appliedByAccountId', foreignKeyConstraintName: 'FK_alloc_actor' })
  appliedByAccount: Relation<UserAccount>;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Sprint } from '../sprints/sprint.entity.js';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  sprintId: string;

  @Column({ type: 'text' })
  title: string;

  @ManyToOne(() => Sprint, (sprint) => sprint.tasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sprintId' })
  sprint: Relation<Sprint>;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Sprint } from '../sprints/sprint.entity.js';
import { TaskStatus } from './task-status.enum.js';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  sprintId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ type: 'double', nullable: true })
  estimatedHours: number | null;

  @ManyToOne(() => Sprint, (sprint) => sprint.tasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sprintId' })
  sprint: Relation<Sprint>;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Project } from '../projects/project.entity.js';
import { Task } from '../tasks/task.entity.js';

@Entity({ name: 'sprints' })
export class Sprint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  projectId: string;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => Project, (project) => project.sprints, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'projectId' })
  project: Relation<Project>;

  @OneToMany(() => Task, (task) => task.sprint)
  tasks: Relation<Task[]>;
}

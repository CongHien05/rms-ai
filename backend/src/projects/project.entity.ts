import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Sprint } from '../sprints/sprint.entity.js';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar', length: 36, charset: 'ascii', collation: 'ascii_bin', nullable: true })
  pmAccountId?: string | null;

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints: Relation<Sprint[]>;
}

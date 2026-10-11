import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { EmployeeSkill } from '../employee-skills/employee-skill.entity.js';

@Entity({ name: 'skills' })
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.skill)
  employeeSkills: Relation<EmployeeSkill[]>;
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { EmployeeSkill } from '../employee-skills/employee-skill.entity.js';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  displayName: string;

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.employee)
  employeeSkills: Relation<EmployeeSkill[]>;
}

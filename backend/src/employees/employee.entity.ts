import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { EmployeeSkill } from '../employee-skills/employee-skill.entity.js';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  displayName: string;

  @Column({ type: 'date', nullable: true })
  availabilityWeekStart: string | null;

  @Column({ type: 'double', nullable: true })
  availableHours: number | null;

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.employee)
  employeeSkills: Relation<EmployeeSkill[]>;
}

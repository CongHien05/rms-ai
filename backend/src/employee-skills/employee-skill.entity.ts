import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Employee } from '../employees/employee.entity.js';
import { Skill } from '../skills/skill.entity.js';

@Entity({ name: 'employee_skills' })
export class EmployeeSkill {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  employeeId: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  skillId: string;

  @ManyToOne(() => Employee, (employee) => employee.employeeSkills, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Relation<Employee>;

  @ManyToOne(() => Skill, (skill) => skill.employeeSkills, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'skillId' })
  skill: Relation<Skill>;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from '../employees/employees.module.js';
import { SkillsModule } from '../skills/skills.module.js';
import { EmployeeSkill } from './employee-skill.entity.js';
import { EmployeeSkillsController } from './employee-skills.controller.js';
import { EmployeeSkillsService } from './employee-skills.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeSkill]),
    EmployeesModule,
    SkillsModule,
  ],
  controllers: [EmployeeSkillsController],
  providers: [EmployeeSkillsService],
})
export class EmployeeSkillsModule {}

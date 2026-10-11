import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { createTypeOrmModuleOptions } from './database/database.config.js';
import { EmployeeSkillsModule } from './employee-skills/employee-skills.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { SkillsModule } from './skills/skills.module.js';
import { SprintsModule } from './sprints/sprints.module.js';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: createTypeOrmModuleOptions }),
    ProjectsModule,
    SprintsModule,
    TasksModule,
    EmployeesModule,
    SkillsModule,
    EmployeeSkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/task.entity.js';
import { Project } from './project.entity.js';
import { ProjectRiskService } from './project-risk.service.js';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { RiskClient } from './risk-client.js';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task])],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRiskService, RiskClient],
  exports: [ProjectsService],
})
export class ProjectsModule {}

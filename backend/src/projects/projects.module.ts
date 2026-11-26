import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from '../employees/employees.module.js';
import { SkillsModule } from '../skills/skills.module.js';
import { Task } from '../tasks/task.entity.js';
import { ProjectResourceRecommendationService } from './project-resource-recommendation.service.js';
import { Project } from './project.entity.js';
import { ProjectRiskService } from './project-risk.service.js';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { ProjectSimulationService } from './project-simulation.service.js';
import { RiskClient } from './risk-client.js';
import { ProjectDecisionsController } from './decisions/project-decisions.controller.js';
import { ProjectDecisionsService } from './decisions/project-decisions.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task]),
    EmployeesModule,
    SkillsModule,
  ],
  controllers: [ProjectsController, ProjectDecisionsController],
  providers: [
    ProjectsService,
    ProjectRiskService,
    ProjectResourceRecommendationService,
    ProjectSimulationService,
    ProjectDecisionsService,
    RiskClient,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}

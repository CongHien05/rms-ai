import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import {
  ProjectRiskService,
  type ProjectRiskAssessment,
} from './project-risk.service.js';
import { ProjectsService, type ProjectResponse } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectRiskService: ProjectRiskService,
  ) {}

  @Post()
  create(@Body() body: CreateProjectDto): Promise<ProjectResponse> {
    return this.projectsService.create(body.name);
  }

  @Get()
  findAll(): Promise<ProjectResponse[]> {
    return this.projectsService.findAll();
  }

  @Get(':projectId')
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ProjectResponse> {
    return this.projectsService.findOne(projectId);
  }

  @Post(':projectId/risk-assessments')
  @HttpCode(200)
  assessRisk(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ProjectRiskAssessment> {
    return this.projectRiskService.assess(projectId);
  }
}

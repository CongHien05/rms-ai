import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CurrentAccount, Roles, type Principal } from '../auth/auth-policy.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { ResourceRecommendationDto } from './dto/resource-recommendation.dto.js';
import {
  ResourceSimulationDto,
  type ResourceSimulationResponseDto,
} from './dto/resource-simulation.dto.js';
import { ProjectSimulationService } from './project-simulation.service.js';
import {
  ProjectResourceRecommendationService,
  type ProjectResourceRecommendations,
} from './project-resource-recommendation.service.js';
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
    private readonly projectResourceRecommendationService: ProjectResourceRecommendationService,
    private readonly projectSimulationService: ProjectSimulationService,
  ) {}

  @Roles('PM')
  @Post()
  create(@CurrentAccount() account: Principal, @Body() body: CreateProjectDto): Promise<ProjectResponse> {
    return this.projectsService.create(body.name, account.accountId);
  }

  @Roles('PM')
  @Get()
  findAll(@CurrentAccount() account: Principal): Promise<ProjectResponse[]> {
    return this.projectsService.findAll(account.accountId);
  }

  @Roles('PM')
  @Get(':projectId')
  findOne(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ProjectResponse> {
    return this.projectsService.requireOwned(projectId, account.accountId);
  }

  @Roles('PM')
  @Post(':projectId/risk-assessments')
  @HttpCode(200)
  async assessRisk(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ProjectRiskAssessment> {
    await this.projectsService.requireOwned(projectId, account.accountId);
    return this.projectRiskService.assess(projectId);
  }

  @Roles('PM')
  @Post(':projectId/resource-recommendations')
  @HttpCode(200)
  async recommendResources(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: ResourceRecommendationDto,
  ): Promise<ProjectResourceRecommendations> {
    await this.projectsService.requireOwned(projectId, account.accountId);
    return this.projectResourceRecommendationService.recommend(projectId, body);
  }

  @Roles('PM')
  @Post(':projectId/simulations')
  @HttpCode(200)
  async simulateResources(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: ResourceSimulationDto,
  ): Promise<ResourceSimulationResponseDto> {
    try {
      await this.projectsService.requireOwned(projectId, account.accountId);
    } catch (error) {
      if (!(error instanceof NotFoundException)) throw error;
      return this.projectSimulationService.rejectMissingProject(projectId, body);
    }
    return this.projectSimulationService.simulate(projectId, body, account.accountId);
  }
}

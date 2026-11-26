import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentAccount, Roles, type Principal } from '../../auth/auth-policy.js';
import { ProjectDecisionHistoryDto } from './dto/project-decision-history.dto.js';
import { ProjectDecisionDto } from './dto/project-decision.dto.js';
import { ProjectDecisionsService } from './project-decisions.service.js';

@Controller('projects/:projectId/decisions')
export class ProjectDecisionsController {
  constructor(private readonly decisions: ProjectDecisionsService) {}

  @Roles('PM')
  @Post()
  async record(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() input: ProjectDecisionDto,
    @Res({ passthrough: true }) http: Response,
  ) {
    const result = await this.decisions.record(projectId.toLowerCase(), account.accountId, input);
    http.status(result.created ? 201 : 200);
    return result.decision;
  }

  @Roles('PM')
  @Get()
  history(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() page: ProjectDecisionHistoryDto,
  ) {
    return this.decisions.history(projectId.toLowerCase(), account.accountId, page);
  }
}

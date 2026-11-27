import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentAccount, Roles, type Principal } from '../../auth/auth-policy.js';
import { AllocationHistoryDto } from './dto/allocation-history.dto.js';
import { ApplyAllocationBodyPipe } from './dto/apply-allocation.dto.js';
import { ProjectAllocationsService } from './project-allocations.service.js';

@Controller('projects/:projectId')
export class ProjectAllocationsController {
  constructor(private readonly allocations: ProjectAllocationsService) {}

  @Roles('PM')
  @Post('decisions/:decisionId/apply')
  async apply(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('decisionId', ParseUUIDPipe) decisionId: string,
    @Body(ApplyAllocationBodyPipe) _body: undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.allocations.apply(projectId.toLowerCase(), decisionId.toLowerCase(), account.accountId);
    response.status(result.created ? 201 : 200);
    return result.allocation;
  }

  @Roles('PM')
  @Get('decisions/:decisionId/apply')
  reconcile(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('decisionId', ParseUUIDPipe) decisionId: string,
  ) {
    return this.allocations.reconcile(projectId.toLowerCase(), decisionId.toLowerCase(), account.accountId);
  }

  @Roles('PM')
  @Get('allocation-results')
  history(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() page: AllocationHistoryDto,
  ) {
    return this.allocations.history(projectId.toLowerCase(), account.accountId, page);
  }
}

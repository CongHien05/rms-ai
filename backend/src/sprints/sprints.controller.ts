import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CurrentAccount, Roles, type Principal } from '../auth/auth-policy.js';
import { CreateSprintDto } from './dto/create-sprint.dto.js';
import { SprintsService, type SprintResponse } from './sprints.service.js';

@Controller('projects/:projectId/sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Roles('PM')
  @Post()
  create(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: CreateSprintDto,
  ): Promise<SprintResponse> {
    return this.sprintsService.create(projectId, body.name, account.accountId);
  }

  @Roles('PM')
  @Get()
  findAll(
    @CurrentAccount() account: Principal,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<SprintResponse[]> {
    return this.sprintsService.findAllByProject(projectId, account.accountId);
  }
}

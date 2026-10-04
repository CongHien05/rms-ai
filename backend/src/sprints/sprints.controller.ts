import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto.js';
import { SprintsService, type SprintResponse } from './sprints.service.js';

@Controller('projects/:projectId/sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: CreateSprintDto,
  ): Promise<SprintResponse> {
    return this.sprintsService.create(projectId, body.name);
  }

  @Get()
  findAll(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<SprintResponse[]> {
    return this.sprintsService.findAllByProject(projectId);
  }
}

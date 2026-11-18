import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService, type TaskResponse } from './tasks.service.js';

@Controller('sprints/:sprintId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Param('sprintId', ParseUUIDPipe) sprintId: string,
    @Body() body: CreateTaskDto,
  ): Promise<TaskResponse> {
    return this.tasksService.create(sprintId, body);
  }

  @Get()
  findAll(
    @Param('sprintId', ParseUUIDPipe) sprintId: string,
  ): Promise<TaskResponse[]> {
    return this.tasksService.findAllBySprint(sprintId);
  }

  @Patch(':taskId')
  update(
    @Param('sprintId', ParseUUIDPipe) sprintId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskResponse> {
    return this.tasksService.update(sprintId, taskId, body);
  }
}

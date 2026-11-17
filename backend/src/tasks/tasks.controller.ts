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
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';
import { TasksService, type TaskResponse } from './tasks.service.js';

@Controller('sprints/:sprintId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Param('sprintId', ParseUUIDPipe) sprintId: string,
    @Body() body: CreateTaskDto,
  ): Promise<TaskResponse> {
    return this.tasksService.create(sprintId, body.title);
  }

  @Get()
  findAll(
    @Param('sprintId', ParseUUIDPipe) sprintId: string,
  ): Promise<TaskResponse[]> {
    return this.tasksService.findAllBySprint(sprintId);
  }

  @Patch(':taskId')
  updateStatus(
    @Param('sprintId', ParseUUIDPipe) sprintId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() body: UpdateTaskStatusDto,
  ): Promise<TaskResponse> {
    return this.tasksService.updateStatus(sprintId, taskId, body.status);
  }

  @Patch(':taskId/status')
  updateStatusAlias(
    @Param('sprintId', ParseUUIDPipe) sprintId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() body: UpdateTaskStatusDto,
  ): Promise<TaskResponse> {
    return this.tasksService.updateStatus(sprintId, taskId, body.status);
  }
}

@Controller('tasks')
export class TasksDirectController {
  constructor(private readonly tasksService: TasksService) {}

  @Patch(':taskId')
  updateStatus(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() body: UpdateTaskStatusDto,
  ): Promise<TaskResponse> {
    return this.tasksService.updateStatusDirect(taskId, body.status);
  }

  @Patch(':taskId/status')
  updateStatusAlias(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() body: UpdateTaskStatusDto,
  ): Promise<TaskResponse> {
    return this.tasksService.updateStatusDirect(taskId, body.status);
  }
}

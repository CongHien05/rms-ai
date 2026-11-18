import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { SprintsService } from '../sprints/sprints.service.js';
import { TaskStatus } from './task-status.enum.js';
import { Task } from './task.entity.js';

export interface CreateTaskInput {
  title: string;
  dueDate?: string | null;
  estimatedHours?: number | null;
}

export interface UpdateTaskInput {
  status?: TaskStatus;
  dueDate?: string | null;
  estimatedHours?: number | null;
}

export interface TaskResponse {
  id: string;
  sprintId: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  estimatedHours: number | null;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly sprintsService: SprintsService,
  ) {}

  async create(
    sprintId: string,
    input: CreateTaskInput,
  ): Promise<TaskResponse> {
    const normalizedTitle = input.title.trim();

    if (!normalizedTitle) {
      throw new BadRequestException('Tiêu đề Task không được để trống.');
    }

    await this.sprintsService.findOne(sprintId);

    const task = this.tasksRepository.create({
      sprintId,
      title: normalizedTitle,
      status: TaskStatus.TODO,
      dueDate: input.dueDate ?? null,
      estimatedHours: input.estimatedHours ?? null,
    });
    return this.toResponse(await this.tasksRepository.save(task));
  }

  async findAllBySprint(sprintId: string): Promise<TaskResponse[]> {
    await this.sprintsService.findOne(sprintId);
    const tasks = await this.tasksRepository.findBy({ sprintId });
    return tasks.map((task) => this.toResponse(task));
  }

  async update(
    sprintId: string,
    taskId: string,
    input: UpdateTaskInput,
  ): Promise<TaskResponse> {
    await this.sprintsService.findOne(sprintId);

    const task = await this.tasksRepository.findOneBy({ id: taskId, sprintId });
    if (!task) {
      throw new NotFoundException('Không tìm thấy Task.');
    }

    if (input.status !== undefined) task.status = input.status;
    if (input.dueDate !== undefined) task.dueDate = input.dueDate;
    if (input.estimatedHours !== undefined) {
      task.estimatedHours = input.estimatedHours;
    }
    return this.toResponse(await this.tasksRepository.save(task));
  }

  private toResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      sprintId: task.sprintId,
      title: task.title,
      status: task.status ?? TaskStatus.TODO,
      dueDate: task.dueDate ?? null,
      estimatedHours: task.estimatedHours ?? null,
    };
  }
}

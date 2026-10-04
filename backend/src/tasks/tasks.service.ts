import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { SprintsService } from '../sprints/sprints.service.js';
import { Task } from './task.entity.js';

export interface TaskResponse {
  id: string;
  sprintId: string;
  title: string;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly sprintsService: SprintsService,
  ) {}

  async create(sprintId: string, title: string): Promise<TaskResponse> {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new BadRequestException('Tiêu đề Task không được để trống.');
    }

    await this.sprintsService.findOne(sprintId);

    const task = this.tasksRepository.create({
      sprintId,
      title: normalizedTitle,
    });
    return this.toResponse(await this.tasksRepository.save(task));
  }

  async findAllBySprint(sprintId: string): Promise<TaskResponse[]> {
    await this.sprintsService.findOne(sprintId);
    const tasks = await this.tasksRepository.findBy({ sprintId });
    return tasks.map((task) => this.toResponse(task));
  }

  private toResponse(task: Task): TaskResponse {
    return { id: task.id, sprintId: task.sprintId, title: task.title };
  }
}

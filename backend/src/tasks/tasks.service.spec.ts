import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { SprintsService } from '../sprints/sprints.service.js';
import { Task } from './task.entity.js';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  const projectId = '11111111-1111-4111-8111-111111111111';
  const sprintId = '22222222-2222-4222-8222-222222222222';
  const taskId = '33333333-3333-4333-8333-333333333333';
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findBy: ReturnType<typeof vi.fn>;
  };
  let sprintsService: { findOne: ReturnType<typeof vi.fn> };
  let service: TasksService;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      save: vi.fn(),
      findBy: vi.fn(),
    };
    sprintsService = { findOne: vi.fn() };
    service = new TasksService(
      repository as unknown as Repository<Task>,
      sprintsService as unknown as SprintsService,
    );
  });

  it('creates a task under an existing sprint', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    const task = { id: taskId, sprintId, title: 'Task 1' } as Task;
    repository.create.mockReturnValue(task);
    repository.save.mockResolvedValue(task);

    await expect(service.create(sprintId, '  Task 1  ')).resolves.toEqual({
      id: taskId,
      sprintId,
      title: 'Task 1',
    });
    expect(repository.create).toHaveBeenCalledWith({
      sprintId,
      title: 'Task 1',
    });
  });

  it('rejects creation when the sprint does not exist', async () => {
    sprintsService.findOne.mockRejectedValue(
      new NotFoundException('Không tìm thấy Sprint.'),
    );

    await expect(service.create(sprintId, 'Task 1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects an empty task title', async () => {
    await expect(service.create(sprintId, '   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(sprintsService.findOne).not.toHaveBeenCalled();
  });

  it('lists only tasks for the requested sprint', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    repository.findBy.mockResolvedValue([
      { id: taskId, sprintId, title: 'Task 1' } as Task,
    ]);

    await expect(service.findAllBySprint(sprintId)).resolves.toEqual([
      { id: taskId, sprintId, title: 'Task 1' },
    ]);
    expect(repository.findBy).toHaveBeenCalledWith({ sprintId });
  });
});

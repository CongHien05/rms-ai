import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { SprintsService } from '../sprints/sprints.service.js';
import { TaskStatus } from './task-status.enum.js';
import { Task } from './task.entity.js';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  const projectId = '11111111-1111-4111-8111-111111111111';
  const sprintId = '22222222-2222-4222-8222-222222222222';
  const otherSprintId = '99999999-9999-4999-8999-999999999999';
  const taskId = '33333333-3333-4333-8333-333333333333';
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findBy: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
  };
  let sprintsService: { findOne: ReturnType<typeof vi.fn> };
  let service: TasksService;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      save: vi.fn(),
      findBy: vi.fn(),
      findOneBy: vi.fn(),
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
    const task = {
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.TODO,
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    } as Task;
    repository.create.mockReturnValue(task);
    repository.save.mockResolvedValue(task);

    await expect(
      service.create(sprintId, {
        title: '  Task 1  ',
        dueDate: '2026-12-01',
        estimatedHours: 3.5,
      }),
    ).resolves.toEqual({
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.TODO,
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    });
    expect(repository.create).toHaveBeenCalledWith({
      sprintId,
      title: 'Task 1',
      status: TaskStatus.TODO,
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    });
  });

  it('rejects creation when the sprint does not exist', async () => {
    sprintsService.findOne.mockRejectedValue(
      new NotFoundException('Không tìm thấy Sprint.'),
    );

    await expect(
      service.create(sprintId, { title: 'Task 1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects an empty task title', async () => {
    await expect(
      service.create(sprintId, { title: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(sprintsService.findOne).not.toHaveBeenCalled();
  });

  it('lists only tasks for the requested sprint', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    repository.findBy.mockResolvedValue([
      {
        id: taskId,
        sprintId,
        title: 'Task 1',
        status: TaskStatus.TODO,
        dueDate: null,
        estimatedHours: null,
      } as Task,
    ]);

    await expect(service.findAllBySprint(sprintId)).resolves.toEqual([
      {
        id: taskId,
        sprintId,
        title: 'Task 1',
        status: TaskStatus.TODO,
        dueDate: null,
        estimatedHours: null,
      },
    ]);
    expect(repository.findBy).toHaveBeenCalledWith({ sprintId });
  });

  it('updates task status without losing planning fields', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    const existingTask = {
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.TODO,
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    } as Task;
    repository.findOneBy.mockResolvedValue(existingTask);
    repository.save.mockImplementation(async (item: Task) => item);

    await expect(
      service.update(sprintId, taskId, { status: TaskStatus.IN_PROGRESS }),
    ).resolves.toEqual({
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    });
    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: taskId,
      sprintId,
    });
  });

  it('rejects status update when sprint does not exist', async () => {
    sprintsService.findOne.mockRejectedValue(
      new NotFoundException('Không tìm thấy Sprint.'),
    );

    await expect(
      service.update(sprintId, taskId, { status: TaskStatus.DONE }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findOneBy).not.toHaveBeenCalled();
  });

  it('rejects status update when task does not exist in sprint', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    repository.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(sprintId, taskId, { status: TaskStatus.DONE }),
    ).rejects.toThrow('Không tìm thấy Task.');
  });

  it('rejects status update when task belongs to a different sprint and keeps data unchanged', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: otherSprintId,
      projectId,
      name: 'Sprint 2',
    });
    // Task exists in DB under sprintId, so query with otherSprintId returns null
    repository.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(otherSprintId, taskId, { status: TaskStatus.DONE }),
    ).rejects.toThrow('Không tìm thấy Task.');

    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: taskId,
      sprintId: otherSprintId,
    });
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('updates one planning field and preserves every omitted field', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    const existingTask = {
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.BLOCKED,
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    } as Task;
    repository.findOneBy.mockResolvedValue(existingTask);
    repository.save.mockImplementation(async (item: Task) => item);

    await expect(
      service.update(sprintId, taskId, { dueDate: '2026-12-15' }),
    ).resolves.toEqual({
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.BLOCKED,
      dueDate: '2026-12-15',
      estimatedHours: 3.5,
    });
  });

  it('clears nullable planning fields when PATCH explicitly sends null', async () => {
    sprintsService.findOne.mockResolvedValue({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    const existingTask = {
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    } as Task;
    repository.findOneBy.mockResolvedValue(existingTask);
    repository.save.mockImplementation(async (item: Task) => item);

    await expect(
      service.update(sprintId, taskId, {
        dueDate: null,
        estimatedHours: null,
      }),
    ).resolves.toEqual({
      id: taskId,
      sprintId,
      title: 'Task 1',
      status: TaskStatus.IN_PROGRESS,
      dueDate: null,
      estimatedHours: null,
    });
  });
});

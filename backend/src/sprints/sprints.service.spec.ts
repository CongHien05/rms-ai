import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { ProjectsService } from '../projects/projects.service.js';
import { Sprint } from './sprint.entity.js';
import { SprintsService } from './sprints.service.js';

describe('SprintsService', () => {
  const projectId = '11111111-1111-4111-8111-111111111111';
  const sprintId = '22222222-2222-4222-8222-222222222222';
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findBy: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
  };
  let projectsService: { findOne: ReturnType<typeof vi.fn> };
  let service: SprintsService;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      save: vi.fn(),
      findBy: vi.fn(),
      findOneBy: vi.fn(),
    };
    projectsService = { findOne: vi.fn() };
    service = new SprintsService(
      repository as unknown as Repository<Sprint>,
      projectsService as unknown as ProjectsService,
    );
  });

  it('creates a sprint under an existing project', async () => {
    projectsService.findOne.mockResolvedValue({ id: projectId, name: 'Alpha' });
    const sprint = { id: sprintId, projectId, name: 'Sprint 1' } as Sprint;
    repository.create.mockReturnValue(sprint);
    repository.save.mockResolvedValue(sprint);

    await expect(service.create(projectId, '  Sprint 1  ')).resolves.toEqual({
      id: sprintId,
      projectId,
      name: 'Sprint 1',
    });
    expect(repository.create).toHaveBeenCalledWith({
      projectId,
      name: 'Sprint 1',
    });
  });

  it('rejects creation when the project does not exist', async () => {
    projectsService.findOne.mockRejectedValue(
      new NotFoundException('Không tìm thấy Project.'),
    );

    await expect(service.create(projectId, 'Sprint 1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects an empty sprint name', async () => {
    await expect(service.create(projectId, '   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(projectsService.findOne).not.toHaveBeenCalled();
  });

  it('lists only sprints for the requested project', async () => {
    projectsService.findOne.mockResolvedValue({ id: projectId, name: 'Alpha' });
    repository.findBy.mockResolvedValue([
      { id: sprintId, projectId, name: 'Sprint 1' } as Sprint,
    ]);

    await expect(service.findAllByProject(projectId)).resolves.toEqual([
      { id: sprintId, projectId, name: 'Sprint 1' },
    ]);
    expect(repository.findBy).toHaveBeenCalledWith({ projectId });
  });
});

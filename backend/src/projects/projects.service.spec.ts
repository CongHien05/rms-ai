import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { Project } from './project.entity.js';
import { ProjectsService } from './projects.service.js';

describe('ProjectsService', () => {
  const projectId = '11111111-1111-4111-8111-111111111111';
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
  };
  let service: ProjectsService;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOneBy: vi.fn(),
    };
    service = new ProjectsService(repository as unknown as Repository<Project>);
  });

  it('creates a project and trims its name', async () => {
    const project = { id: projectId, name: 'Project Alpha' } as Project;
    repository.create.mockReturnValue(project);
    repository.save.mockResolvedValue(project);

    await expect(service.create('  Project Alpha  ')).resolves.toEqual({
      id: projectId,
      name: 'Project Alpha',
    });
    expect(repository.create).toHaveBeenCalledWith({ name: 'Project Alpha' });
  });

  it('rejects an empty project name', async () => {
    await expect(service.create('   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('returns not found for an unknown project', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(projectId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

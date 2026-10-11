import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { Skill } from './skill.entity.js';
import { SkillsService } from './skills.service.js';

describe('SkillsService', () => {
  const skillId = '55555555-5555-4555-8555-555555555555';
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
  };
  let service: SkillsService;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOneBy: vi.fn(),
    };
    service = new SkillsService(repository as unknown as Repository<Skill>);
  });

  it('creates a skill and trims its name', async () => {
    const skill = { id: skillId, name: 'TypeScript' } as Skill;
    repository.create.mockReturnValue(skill);
    repository.save.mockResolvedValue(skill);

    await expect(service.create('  TypeScript  ')).resolves.toEqual({
      id: skillId,
      name: 'TypeScript',
    });
    expect(repository.create).toHaveBeenCalledWith({ name: 'TypeScript' });
  });

  it('rejects an empty skill name', async () => {
    await expect(service.create('   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('lists skills', async () => {
    repository.find.mockResolvedValue([
      { id: skillId, name: 'TypeScript' } as Skill,
    ]);

    await expect(service.findAll()).resolves.toEqual([
      { id: skillId, name: 'TypeScript' },
    ]);
  });

  it('returns an existing skill', async () => {
    repository.findOneBy.mockResolvedValue({
      id: skillId,
      name: 'TypeScript',
    } as Skill);

    await expect(service.findOne(skillId)).resolves.toEqual({
      id: skillId,
      name: 'TypeScript',
    });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: skillId });
  });

  it('returns not found for an unknown skill', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(skillId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

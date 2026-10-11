import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, type Repository } from 'typeorm';
import type { EmployeesService } from '../employees/employees.service.js';
import { Skill } from '../skills/skill.entity.js';
import type { SkillsService } from '../skills/skills.service.js';
import { EmployeeSkill } from './employee-skill.entity.js';
import { EmployeeSkillsService } from './employee-skills.service.js';

describe('EmployeeSkillsService', () => {
  const employeeId = '44444444-4444-4444-8444-444444444444';
  const skillId = '55555555-5555-4555-8555-555555555555';
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
  };
  let employeesService: { findOne: ReturnType<typeof vi.fn> };
  let skillsService: { findOne: ReturnType<typeof vi.fn> };
  let service: EmployeeSkillsService;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOneBy: vi.fn(),
    };
    employeesService = { findOne: vi.fn() };
    skillsService = { findOne: vi.fn() };
    service = new EmployeeSkillsService(
      repository as unknown as Repository<EmployeeSkill>,
      employeesService as unknown as EmployeesService,
      skillsService as unknown as SkillsService,
    );
  });

  function mockExistingParents(): void {
    employeesService.findOne.mockResolvedValue({
      id: employeeId,
      displayName: 'Nguyen Van An',
    });
    skillsService.findOne.mockResolvedValue({
      id: skillId,
      name: 'TypeScript',
    });
  }

  it('assigns an existing skill to an existing employee', async () => {
    mockExistingParents();
    const relation = { employeeId, skillId } as EmployeeSkill;
    repository.findOneBy.mockResolvedValue(null);
    repository.create.mockReturnValue(relation);
    repository.save.mockResolvedValue(relation);

    await expect(service.assign(employeeId, skillId)).resolves.toEqual({
      employeeId,
      skillId,
    });
    expect(repository.create).toHaveBeenCalledWith({ employeeId, skillId });
  });

  it('rejects assignment when the employee does not exist', async () => {
    employeesService.findOne.mockRejectedValue(
      new NotFoundException('Không tìm thấy Employee.'),
    );

    await expect(service.assign(employeeId, skillId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(skillsService.findOne).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects assignment when the skill does not exist', async () => {
    employeesService.findOne.mockResolvedValue({
      id: employeeId,
      displayName: 'Nguyen Van An',
    });
    skillsService.findOne.mockRejectedValue(
      new NotFoundException('Không tìm thấy Skill.'),
    );

    await expect(service.assign(employeeId, skillId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.findOneBy).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('returns conflict for a duplicate employee skill relation', async () => {
    mockExistingParents();
    repository.findOneBy.mockResolvedValue({
      employeeId,
      skillId,
    } as EmployeeSkill);

    await expect(service.assign(employeeId, skillId)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('returns conflict when the composite key is inserted concurrently', async () => {
    mockExistingParents();
    const relation = { employeeId, skillId } as EmployeeSkill;
    const driverError = Object.assign(new Error('Duplicate entry'), {
      code: 'ER_DUP_ENTRY',
    });
    repository.findOneBy.mockResolvedValue(null);
    repository.create.mockReturnValue(relation);
    repository.save.mockRejectedValue(
      new QueryFailedError('INSERT INTO employee_skills', [], driverError),
    );

    await expect(service.assign(employeeId, skillId)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('lists only skills assigned to the requested employee', async () => {
    employeesService.findOne.mockResolvedValue({
      id: employeeId,
      displayName: 'Nguyen Van An',
    });
    repository.find.mockResolvedValue([
      {
        employeeId,
        skillId,
        skill: { id: skillId, name: 'TypeScript' } as Skill,
      } as EmployeeSkill,
    ]);

    await expect(service.findByEmployee(employeeId)).resolves.toEqual([
      { id: skillId, name: 'TypeScript' },
    ]);
    expect(repository.find).toHaveBeenCalledWith({
      where: { employeeId },
      relations: { skill: true },
    });
  });
});

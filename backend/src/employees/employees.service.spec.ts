import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { Employee } from './employee.entity.js';
import { EmployeesService } from './employees.service.js';
import type { RemainingAvailabilityService } from './remaining-availability.service.js';

describe('EmployeesService', () => {
  const employeeId = '44444444-4444-4444-8444-444444444444';
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
  };
  let service: EmployeesService;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
    };
    service = new EmployeesService(
      repository as unknown as Repository<Employee>,
      {} as RemainingAvailabilityService,
    );
  });

  it('creates an employee and trims the display name', async () => {
    const employee = {
      id: employeeId,
      displayName: 'Nguyen Van An',
    } as Employee;
    repository.create.mockReturnValue(employee);
    repository.save.mockResolvedValue(employee);

    await expect(service.create('  Nguyen Van An  ')).resolves.toEqual({
      id: employeeId,
      displayName: 'Nguyen Van An',
    });
    expect(repository.create).toHaveBeenCalledWith({
      displayName: 'Nguyen Van An',
    });
  });

  it('rejects an empty employee display name', async () => {
    await expect(service.create('   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('lists employees', async () => {
    repository.find.mockResolvedValue([
      { id: employeeId, displayName: 'Nguyen Van An' } as Employee,
    ]);

    await expect(service.findAll()).resolves.toEqual([
      { id: employeeId, displayName: 'Nguyen Van An' },
    ]);
  });

  it('returns an existing employee', async () => {
    repository.findOneBy.mockResolvedValue({
      id: employeeId,
      displayName: 'Nguyen Van An',
    } as Employee);

    await expect(service.findOne(employeeId)).resolves.toEqual({
      id: employeeId,
      displayName: 'Nguyen Van An',
    });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: employeeId });
  });

  it('returns not found for an unknown employee', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(employeeId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('keeps raw weekly availability in the proposal roster', async () => {
    const roster = [
      { availabilityWeekStart: null, availableHours: null },
      { availabilityWeekStart: '2026-11-16', availableHours: 0 },
      { availabilityWeekStart: '2026-11-09', availableHours: 8 },
    ];
    repository.find.mockResolvedValue(roster);
    await expect(service.findAvailabilityForSkill('skill')).resolves.toEqual(roster);
    expect(repository.find).toHaveBeenCalledWith({
      select: { id: true, displayName: true, availabilityWeekStart: true, availableHours: true },
      where: { employeeSkills: { skillId: 'skill' } },
    });
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('reads association and availability together and keeps zero distinct from missing', async () => {
    repository.findOne.mockResolvedValueOnce({
      id: employeeId, availabilityWeekStart: '2026-11-16', availableHours: 0,
      employeeSkills: [{ skillId: 'skill' }],
    }).mockResolvedValueOnce({
      id: employeeId, availabilityWeekStart: '2026-11-09', availableHours: null,
      employeeSkills: [],
    }).mockResolvedValueOnce(null);
    await expect(service.findSimulationAvailability(employeeId, 'skill')).resolves.toEqual({
      weekStart: '2026-11-16', availableHours: 0, matchesSkill: true,
    });
    await expect(service.findSimulationAvailability(employeeId, 'skill')).resolves.toEqual({
      weekStart: '2026-11-09', availableHours: null, matchesSkill: false,
    });
    await expect(service.findSimulationAvailability(employeeId, 'skill')).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findOne).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: employeeId }, relations: { employeeSkills: true }, relationLoadStrategy: 'join',
    }));
    expect(repository.save).not.toHaveBeenCalled();
  });
});

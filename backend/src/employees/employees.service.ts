import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, type Repository } from 'typeorm';
import type { SkillResponse } from '../skills/skills.service.js';
import { getAvailabilityWeek } from './availability-week.js';
import { Employee } from './employee.entity.js';

export interface EmployeeResponse {
  id: string;
  displayName: string;
}

export interface EmployeeAvailabilityResponse {
  weekStart: string;
  weekEnd: string;
  employees: (EmployeeResponse & {
    skills: SkillResponse[];
    availability: { weekStart: string; hours: number } | null;
  })[];
}

export type AvailableEmployee = EmployeeResponse & { availableHours: number };

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async create(displayName: string): Promise<EmployeeResponse> {
    const normalizedDisplayName = displayName.trim();

    if (!normalizedDisplayName) {
      throw new BadRequestException(
        'Tên hiển thị của Employee không được để trống.',
      );
    }

    const employee = this.employeesRepository.create({
      displayName: normalizedDisplayName,
    });
    return this.toResponse(await this.employeesRepository.save(employee));
  }

  async findAll(): Promise<EmployeeResponse[]> {
    const employees = await this.employeesRepository.find();
    return employees.map((employee) => this.toResponse(employee));
  }

  async findAvailability(): Promise<EmployeeAvailabilityResponse> {
    const week = getAvailabilityWeek();
    const employees = await this.employeesRepository.find({
      relations: { employeeSkills: { skill: true } },
      order: { displayName: 'ASC', id: 'ASC' },
    });
    return {
      ...week,
      employees: employees.map((employee) => {
        const { availabilityWeekStart, availableHours } = employee;
        return {
          ...this.toResponse(employee),
          skills: employee.employeeSkills
            .map(({ skill }) => ({ id: skill.id, name: skill.name }))
            .sort((left, right) => left.name.localeCompare(right.name, 'vi')),
          availability:
            availabilityWeekStart != null && availableHours != null
              ? { weekStart: availabilityWeekStart, hours: availableHours }
              : null,
        };
      }),
    };
  }

  async findAvailableForSkill(
    skillId: string,
    weekStart: string,
  ): Promise<AvailableEmployee[]> {
    const employees = await this.employeesRepository.find({
      select: { id: true, displayName: true, availableHours: true },
      where: {
        employeeSkills: { skillId },
        availabilityWeekStart: weekStart,
        availableHours: MoreThan(0),
      },
    });
    return employees.flatMap(({ id, displayName, availableHours }) =>
      availableHours === null ? [] : [{ id, displayName, availableHours }],
    );
  }

  async findOne(employeeId: string): Promise<EmployeeResponse> {
    const employee = await this.employeesRepository.findOneBy({
      id: employeeId,
    });

    if (!employee) {
      throw new NotFoundException('Không tìm thấy Employee.');
    }

    return this.toResponse(employee);
  }

  private toResponse(employee: Employee): EmployeeResponse {
    return { id: employee.id, displayName: employee.displayName };
  }
}

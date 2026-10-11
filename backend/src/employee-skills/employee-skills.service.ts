import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, type Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service.js';
import { SkillsService, type SkillResponse } from '../skills/skills.service.js';
import { EmployeeSkill } from './employee-skill.entity.js';

export interface EmployeeSkillResponse {
  employeeId: string;
  skillId: string;
}

function isDuplicateEntryError(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as Error & { code?: string }).code === 'ER_DUP_ENTRY'
  );
}

@Injectable()
export class EmployeeSkillsService {
  constructor(
    @InjectRepository(EmployeeSkill)
    private readonly employeeSkillsRepository: Repository<EmployeeSkill>,
    private readonly employeesService: EmployeesService,
    private readonly skillsService: SkillsService,
  ) {}

  async assign(
    employeeId: string,
    skillId: string,
  ): Promise<EmployeeSkillResponse> {
    await this.employeesService.findOne(employeeId);
    await this.skillsService.findOne(skillId);

    const existingRelation = await this.employeeSkillsRepository.findOneBy({
      employeeId,
      skillId,
    });

    if (existingRelation) {
      throw new ConflictException('Employee đã có Skill này.');
    }

    const employeeSkill = this.employeeSkillsRepository.create({
      employeeId,
      skillId,
    });
    try {
      const savedRelation =
        await this.employeeSkillsRepository.save(employeeSkill);
      return {
        employeeId: savedRelation.employeeId,
        skillId: savedRelation.skillId,
      };
    } catch (error) {
      if (isDuplicateEntryError(error)) {
        throw new ConflictException('Employee đã có Skill này.');
      }

      throw error;
    }
  }

  async findByEmployee(employeeId: string): Promise<SkillResponse[]> {
    await this.employeesService.findOne(employeeId);
    const employeeSkills = await this.employeeSkillsRepository.find({
      where: { employeeId },
      relations: { skill: true },
    });
    return employeeSkills.map(({ skill }) => ({
      id: skill.id,
      name: skill.name,
    }));
  }
}

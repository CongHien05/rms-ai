import { BadRequestException, Injectable } from '@nestjs/common';
import { isAvailabilityWeekStart } from '../employees/availability-week.js';
import { EmployeesService } from '../employees/employees.service.js';
import { SkillsService, type SkillResponse } from '../skills/skills.service.js';
import type { ResourceRecommendationDto } from './dto/resource-recommendation.dto.js';
import { ProjectsService } from './projects.service.js';

export interface ProjectResourceRecommendations {
  projectId: string;
  skill: SkillResponse;
  weekStart: string;
  requiredHours: number;
  candidates: {
    employeeId: string;
    displayName: string;
    availableHours: number;
    supportHours: number;
  }[];
}

@Injectable()
export class ProjectResourceRecommendationService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly skillsService: SkillsService,
    private readonly employeesService: EmployeesService,
  ) {}

  async recommend(
    projectId: string,
    { skillId, weekStart, requiredHours }: ResourceRecommendationDto,
  ): Promise<ProjectResourceRecommendations> {
    if (!isAvailabilityWeekStart(weekStart)) {
      throw new BadRequestException(
        'Ngày bắt đầu tuần phải là thứ Hai hợp lệ theo định dạng YYYY-MM-DD.',
      );
    }

    const project = await this.projectsService.findOne(projectId);
    const skill = await this.skillsService.findOne(skillId);
    const employees = await this.employeesService.findAvailableForSkill(
      skill.id,
      weekStart,
    );
    const candidates = employees
      .map(({ id, displayName, availableHours }) => ({
        employeeId: id,
        displayName,
        availableHours,
        supportHours: Math.min(availableHours, requiredHours),
      }))
      .sort(
        (left, right) =>
          right.supportHours - left.supportHours ||
          left.displayName.localeCompare(right.displayName, 'vi') ||
          left.employeeId.localeCompare(right.employeeId),
      );

    return {
      projectId: project.id,
      skill,
      weekStart,
      requiredHours,
      candidates,
    };
  }
}

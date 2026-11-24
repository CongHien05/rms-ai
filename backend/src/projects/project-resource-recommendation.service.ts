import { BadRequestException, Injectable } from '@nestjs/common';
import { isAvailabilityWeekStart } from '../employees/availability-week.js';
import { EmployeesService } from '../employees/employees.service.js';
import { SkillsService, type SkillResponse } from '../skills/skills.service.js';
import type { ResourceRecommendationDto } from './dto/resource-recommendation.dto.js';
import { ProjectsService } from './projects.service.js';
import {
  issueRecommendationProof,
  recommendationKey,
} from './recommendation-context.js';

export interface ProjectResourceRecommendations {
  projectId: string;
  skill: SkillResponse;
  weekStart: string;
  requiredHours: number;
  outcome: 'candidates_available' | 'unavailable' | 'no_suitable_candidate';
  candidates: {
    employeeId: string;
    displayName: string;
    availableHours: number;
    supportHours: number;
    recommendationContext?: string;
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
    const employees = await this.employeesService.findAvailabilityForSkill(
      skill.id,
    );
    const key = recommendationKey();
    const candidates = employees
      .flatMap(({ id, displayName, availableHours, availabilityWeekStart }) => {
        if (
          availabilityWeekStart !== weekStart ||
          availableHours === null ||
          !Number.isFinite(availableHours) ||
          availableHours <= 0
        )
          return [];
        return [
          {
            employeeId: id,
            displayName,
            availableHours,
            supportHours: Math.min(availableHours, requiredHours),
            ...(key && {
              recommendationContext: issueRecommendationProof(key, {
                projectId: project.id,
                employeeId: id,
                skillId: skill.id,
                weekStart,
                requiredHours,
              }),
            }),
          },
        ];
      })
      .sort(
        (left, right) =>
          right.supportHours - left.supportHours ||
          left.displayName.localeCompare(right.displayName, 'vi') ||
          left.employeeId.localeCompare(right.employeeId),
      );

    const missingAvailability = employees.some(
      (employee) =>
        employee.availabilityWeekStart !== weekStart ||
        employee.availableHours === null,
    );
    let outcome: ProjectResourceRecommendations['outcome'];
    if (candidates.length > 0) outcome = 'candidates_available';
    else
      outcome = missingAvailability ? 'unavailable' : 'no_suitable_candidate';
    return {
      projectId: project.id,
      skill,
      weekStart,
      requiredHours,
      outcome,
      candidates,
    };
  }
}

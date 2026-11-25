import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isAvailabilityWeekStart } from '../employees/availability-week.js';
import { EmployeesService } from '../employees/employees.service.js';
import { SkillsService } from '../skills/skills.service.js';
import type {
  ResourceSimulationDto,
  ResourceSimulationResponseDto,
} from './dto/resource-simulation.dto.js';
import { calculateSimulationImpact } from './project-hours.js';
import { ProjectsService } from './projects.service.js';
import {
  normalizeRecommendationContext,
  recommendationKey,
  simulationReference,
  verifyRecommendationProof,
} from './recommendation-context.js';

@Injectable()
export class ProjectSimulationService {
  constructor(
    private readonly projects: ProjectsService,
    private readonly skills: SkillsService,
    private readonly employees: EmployeesService,
  ) {}

  async simulate(
    projectId: string,
    input: ResourceSimulationDto,
  ): Promise<ResourceSimulationResponseDto> {
    const { context, supportHours } = this.verifyScenario(projectId, input);
    const { requiredHours, weekStart } = context;
    const availability = await this.readAvailability(context);
    if (!availability.matchesSkill) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'INVALID_SCENARIO',
        message: 'Ứng viên không còn kỹ năng yêu cầu.',
      });
    }
    const { availableHours } = availability;
    if (availableHours === null || availability.weekStart !== weekStart) {
      throw new UnprocessableEntityException({
        statusCode: 422,
        code: 'MISSING_AVAILABILITY',
        message: 'Chưa có dữ liệu giờ trống cho tuần đã chọn.',
      });
    }
    if (!Number.isFinite(availableHours) || availableHours < 0) {
      throw new InternalServerErrorException('Dữ liệu giờ trống không hợp lệ.');
    }
    const expectedImpact = calculateSimulationImpact(requiredHours, supportHours, availableHours);
    if (!expectedImpact) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'INVALID_SCENARIO',
        message: 'Số giờ hỗ trợ vượt giờ trống hiện có.',
      });
    }
    return {
      outcome: 'available',
      scenarioReference: simulationReference(context, supportHours),
      runId: input.runId,
      snapshot: { ...context, supportHours, availableHours },
      expectedImpact,
    };
  }

  rejectMissingProject(projectId: string, input: ResourceSimulationDto): never {
    this.verifyScenario(projectId, input);
    throw new NotFoundException({
      statusCode: 404,
      code: 'INVALID_SCENARIO',
      message: 'Dự án, ứng viên hoặc kỹ năng không còn khả dụng.',
    });
  }

  private verifyScenario(projectId: string, input: ResourceSimulationDto) {
    const {
      employeeId,
      skillId,
      weekStart,
      requiredHours,
      supportHours,
      recommendationContext,
    } = input.scenario;
    if (
      !isAvailabilityWeekStart(weekStart) ||
      !Number.isFinite(supportHours) ||
      supportHours <= 0 ||
      !Number.isFinite(requiredHours) ||
      requiredHours <= 0
    ) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'INVALID_SCENARIO',
        message: 'Tuần hoặc số giờ không hợp lệ.',
      });
    }
    const key = recommendationKey();
    if (!key) throw this.unavailable();

    const context = normalizeRecommendationContext({
      projectId,
      employeeId,
      skillId,
      weekStart,
      requiredHours,
    });
    if (!verifyRecommendationProof(key, context, recommendationContext)) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'INVALID_SCENARIO',
        message: 'Ngữ cảnh đề xuất không hợp lệ. Hãy tải lại đề xuất.',
      });
    }

    return { context, supportHours };
  }

  private async readAvailability(context: {
    projectId: string;
    employeeId: string;
    skillId: string;
  }) {
    try {
      const [, , availability] = await Promise.all([
        this.projects.findOne(context.projectId),
        this.skills.findOne(context.skillId),
        this.employees.findSimulationAvailability(
          context.employeeId,
          context.skillId,
        ),
      ]);
      return availability;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          statusCode: 404,
          code: 'INVALID_SCENARIO',
          message: 'Dự án, ứng viên hoặc kỹ năng không còn khả dụng.',
        });
      }
      if (error instanceof HttpException) throw error;
      throw this.unavailable();
    }
  }

  private unavailable() {
    return new ServiceUnavailableException({
      statusCode: 503,
      code: 'SIMULATION_UNAVAILABLE',
      message: 'Chưa thể mô phỏng. Vui lòng thử lại.',
    });
  }
}

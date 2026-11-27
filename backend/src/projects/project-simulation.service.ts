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
import { decimalFromNumber, decimalText, parseDecimalHours, parsePositiveSupport, projectHoursNumber } from '../employees/decimal-hours.js';
import { RemainingAvailabilityService } from '../employees/remaining-availability.service.js';
import { SkillsService } from '../skills/skills.service.js';
import type {
  ResourceSimulationDto,
  ResourceSimulationResponseDto,
} from './dto/resource-simulation.dto.js';
import { calculateExactImpact } from './project-hours.js';
import { decisionKey, issueDecisionEvidence } from './decision-context.js';
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
    private readonly availability: RemainingAvailabilityService,
  ) {}

  async simulate(
    projectId: string,
    input: ResourceSimulationDto,
    pmAccountId?: string,
  ): Promise<ResourceSimulationResponseDto> {
    const { context, supportHours, support } = this.verifyScenario(projectId, input);
    const { requiredHours } = context;
    const { eligibility, capacity } = await this.readAvailability(context);
    if (!eligibility.matchesSkill) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'INVALID_SCENARIO',
        message: 'Ứng viên không còn kỹ năng yêu cầu.',
      });
    }
    if (!capacity || capacity.status === 'MISSING') {
      throw new UnprocessableEntityException({
        statusCode: 422,
        code: 'MISSING_AVAILABILITY',
        message: 'Chưa có dữ liệu giờ trống cho tuần đã chọn.',
      });
    }
    const available = parseDecimalHours(capacity.remainingHoursExact);
    if (!available || capacity.status === 'OVER_ALLOCATED') {
      throw new InternalServerErrorException('Dữ liệu giờ trống không hợp lệ.');
    }
    const impact = calculateExactImpact(decimalFromNumber(requiredHours), support, available);
    if (!impact) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'INVALID_SCENARIO',
        message: 'Số giờ hỗ trợ vượt giờ trống hiện có.',
      });
    }
    const supportHoursExact = decimalText(support);
    const snapshotExact = { supportHoursExact, availableHoursExact: decimalText(available) };
    const snapshot = { ...context, supportHours, availableHours: projectHoursNumber(available, true) };
    const expectedImpact = impact.numeric;
    const key = pmAccountId ? decisionKey() : null;
    return {
      outcome: 'available',
      scenarioReference: simulationReference(context, supportHours, supportHoursExact),
      runId: input.runId,
      snapshot,
      expectedImpact,
      snapshotExact, expectedImpactExact: impact.exact,
      ...(key && pmAccountId ? { decisionEvidence: issueDecisionEvidence(key, pmAccountId, { snapshot, expectedImpact, snapshotExact }) } : {}),
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
      supportHoursExact,
      recommendationContext,
    } = input.scenario;
    const support = supportHoursExact === undefined
      ? (Number.isFinite(supportHours) && supportHours > 0 ? decimalFromNumber(supportHours) : null)
      : parsePositiveSupport(supportHoursExact);
    if (
      !isAvailabilityWeekStart(weekStart) ||
      !Number.isFinite(supportHours) ||
      !support || projectHoursNumber(support, true) !== supportHours ||
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

    return { context, supportHours, support };
  }

  private async readAvailability(context: {
    projectId: string;
    employeeId: string;
    skillId: string;
    weekStart: string;
  }) {
    try {
      const [, , eligibility, capacity] = await Promise.all([
        this.projects.findOne(context.projectId),
        this.skills.findOne(context.skillId),
        this.employees.findSimulationAvailability(
          context.employeeId,
          context.skillId,
        ),
        this.availability.forEmployee(context.employeeId, context.weekStart),
      ]);
      return { eligibility, capacity };
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

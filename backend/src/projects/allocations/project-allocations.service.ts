import { randomUUID } from 'node:crypto';
import {
  ConflictException, HttpException, Injectable, NotFoundException, ServiceUnavailableException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, type EntityManager } from 'typeorm';
import { forbidden, unauthenticated } from '../../auth/auth-policy.js';
import type { UserAccount } from '../../auth/user-account.entity.js';
import { EmployeeSkill } from '../../employee-skills/employee-skill.entity.js';
import { getAvailabilityWeek } from '../../employees/availability-week.js';
import { compareHours, parseDecimalHours, parsePositiveSupport } from '../../employees/decimal-hours.js';
import { Employee } from '../../employees/employee.entity.js';
import { RemainingAvailabilityService } from '../../employees/remaining-availability.service.js';
import { DecisionAvailabilityEvidence, remainingSemantics } from '../decisions/decision-availability-evidence.entity.js';
import { PMDecision } from '../decisions/pm-decision.entity.js';
import { ProjectsService } from '../projects.service.js';
import { ApplicationResult, type ApplicationFailureCode } from './application-result.entity.js';
import type { AllocationHistoryDto } from './dto/allocation-history.dto.js';
import { ProjectAllocation } from './project-allocation.entity.js';

const failureMessages: Record<ApplicationFailureCode, string> = {
  DECISION_NOT_ACCEPTED: 'Chỉ áp dụng quyết định ACCEPT.',
  LEGACY_DECISION: 'Hãy mô phỏng và chấp nhận một lượt mới.',
  STALE_ALLOCATION: 'Dữ liệu đã thay đổi. Hãy mô phỏng và chấp nhận lượt mới.',
  AVAILABILITY_MISSING: 'Chưa có khai báo giờ trống đúng tuần.',
  INSUFFICIENT_AVAILABILITY: 'Giờ còn lại không đủ.',
  AVAILABILITY_OVER_ALLOCATED: 'Dữ liệu cho thấy quỹ giờ đã bị vượt mức.',
};

function businessFailure(code: ApplicationFailureCode) {
  return new ConflictException({ statusCode: 409, code, message: failureMessages[code] });
}

function temporarilyUnavailable(unconfirmed: boolean) {
  return new ServiceUnavailableException({
    statusCode: 503,
    code: unconfirmed ? 'APPLICATION_UNCONFIRMED' : 'APPLICATION_RETRYABLE',
    message: unconfirmed ? 'Chưa xác nhận được kết quả. Hãy đối chiếu lại.' : 'Chưa ghi phân bổ. Có thể thử lại.',
  });
}

function allocationResponse(row: ProjectAllocation, decision: PMDecision) {
  const { id, decisionId, projectId, employeeId, skillId, weekStart, hoursExact, appliedByAccountId, appliedAt } = row;
  return {
    id, decisionId, projectId, employeeId, skillId, weekStart, hoursExact, appliedByAccountId, appliedAt,
    decidedByAccountId: decision.pmAccountId, status: 'APPLIED' as const,
  };
}

@Injectable()
export class ProjectAllocationsService {
  constructor(
    @InjectDataSource() private readonly database: DataSource,
    private readonly projects: ProjectsService,
    private readonly availability: RemainingAvailabilityService,
  ) {}

  async apply(projectId: string, decisionId: string, actor: string) {
    const runner = this.database.createQueryRunner('master');
    let commitStarted = false;
    let confirmedFailure: ApplicationFailureCode | undefined;
    try {
      await runner.connect();
      await runner.startTransaction('READ COMMITTED');
      const manager = runner.manager;
      await this.authorize(manager, projectId, actor, 'pessimistic_write');
      const decision = await this.decision(manager, projectId, decisionId);
      const existing = await this.allocation(manager, projectId, decisionId);
      if (existing) {
        await runner.commitTransaction();
        return { created: false, allocation: allocationResponse(existing, decision) };
      }

      const eligibility = await this.checkEligibility(manager, decision);
      if ('code' in eligibility) {
        confirmedFailure = eligibility.code;
        await manager.getRepository(ApplicationResult).insert({
          id: randomUUID(), decisionId, actorAccountId: actor, outcome: 'FAILED',
          code: confirmedFailure, allocationId: null, occurredAt: new Date(),
        });
        await runner.commitTransaction();
        throw businessFailure(confirmedFailure);
      }

      const { employeeId, skillId, weekStart } = decision.snapshot;
      const row = manager.getRepository(ProjectAllocation).create({
        id: randomUUID(), decisionId, projectId, employeeId, skillId, weekStart,
        hoursExact: eligibility.hours, appliedByAccountId: actor, appliedAt: eligibility.appliedAt,
      });
      await manager.getRepository(ProjectAllocation).insert(row);
      await manager.getRepository(ApplicationResult).insert({
        id: randomUUID(), decisionId, actorAccountId: actor, outcome: 'APPLIED',
        code: null, allocationId: row.id, occurredAt: row.appliedAt,
      });
      commitStarted = true;
      await runner.commitTransaction();
      return { created: true, allocation: allocationResponse(row, decision) };
    } catch (error) {
      if (runner.isTransactionActive) await runner.rollbackTransaction().catch(() => undefined);
      if (confirmedFailure) throw businessFailure(confirmedFailure);
      if (error instanceof HttpException) throw error;
      if (!commitStarted && error instanceof QueryFailedError &&
          'errno' in error.driverError && error.driverError.errno === 1062) {
        await runner.release();
        const saved = await this.reconcile(projectId, decisionId, actor);
        if (saved.status === 'APPLIED') return { created: false, allocation: saved };
      }
      throw temporarilyUnavailable(commitStarted);
    } finally {
      if (!runner.isReleased) await runner.release().catch(() => undefined);
    }
  }

  async reconcile(projectId: string, decisionId: string, actor: string) {
    return this.read(async (manager) => {
      await this.authorize(manager, projectId, actor, 'pessimistic_read');
      const decision = await this.decision(manager, projectId, decisionId);
      const existing = await this.allocation(manager, projectId, decisionId);
      if (existing) return allocationResponse(existing, decision);
      const latest = await manager.getRepository(ApplicationResult).findOne({
        where: { decisionId, outcome: 'FAILED' }, order: { occurredAt: 'DESC', id: 'DESC' },
      });
      return {
        decisionId, status: 'NOT_APPLIED' as const,
        latestFailure: latest ? { code: latest.code, occurredAt: latest.occurredAt } : null,
      };
    });
  }

  async history(projectId: string, actor: string, page: AllocationHistoryDto) {
    return this.read(async (manager) => {
      await this.authorize(manager, projectId, actor, 'pessimistic_read');
      const rows = await manager.getRepository(ApplicationResult).createQueryBuilder('result')
        .innerJoinAndSelect('result.decision', 'decision', 'decision.projectId = :projectId', { projectId })
        .leftJoinAndSelect('result.allocation', 'allocation', 'allocation.projectId = :projectId')
        .orderBy('result.occurredAt', 'DESC').addOrderBy('result.id', 'DESC')
        .skip(page.offset).take(page.limit + 1).getMany();
      const items = rows.slice(0, page.limit).map((row) => ({
        id: row.id, decisionId: row.decisionId, outcome: row.outcome, code: row.code,
        occurredAt: row.occurredAt, decidedByAccountId: row.decision.pmAccountId, actorAccountId: row.actorAccountId,
        allocation: row.allocation ? allocationResponse(row.allocation, row.decision) : null,
      }));
      return { items, hasMore: rows.length > page.limit };
    });
  }

  private async read<T>(work: (manager: EntityManager) => Promise<T>) {
    const runner = this.database.createQueryRunner('master');
    try {
      await runner.connect();
      await runner.startTransaction('READ COMMITTED');
      const result = await work(runner.manager);
      await runner.commitTransaction();
      return result;
    } catch (error) {
      if (runner.isTransactionActive) await runner.rollbackTransaction().catch(() => undefined);
      if (error instanceof HttpException) throw error;
      throw temporarilyUnavailable(true);
    } finally {
      await runner.release().catch(() => undefined);
    }
  }

  private async authorize(manager: EntityManager, projectId: string, actor: string, lock: 'pessimistic_read' | 'pessimistic_write') {
    const [account] = await manager.query(
      'SELECT role, disabledAt FROM user_accounts WHERE id = ? LOCK IN SHARE MODE', [actor],
    ) as Pick<UserAccount, 'role' | 'disabledAt'>[];
    if (!account || account.disabledAt) throw unauthenticated();
    if (account.role !== 'PM') throw forbidden();
    try {
      await this.projects.requireOwned(projectId, actor, { manager, lock });
    } catch (error) {
      if (error instanceof NotFoundException) throw this.notFound();
      throw error;
    }
  }

  private notFound() {
    return new NotFoundException({ statusCode: 404, code: 'NOT_FOUND', message: 'Không tìm thấy quyết định hoặc dự án.' });
  }

  private async decision(manager: EntityManager, projectId: string, id: string) {
    const row = await manager.getRepository(PMDecision).findOneBy({ id, projectId });
    if (!row) throw this.notFound();
    return row;
  }

  private allocation(manager: EntityManager, projectId: string, decisionId: string) {
    return manager.getRepository(ProjectAllocation).findOneBy({ projectId, decisionId });
  }

  private async checkEligibility(
    manager: EntityManager, decision: PMDecision,
  ): Promise<{ code: ApplicationFailureCode } | { hours: string; appliedAt: Date }> {
    if (decision.decision !== 'ACCEPT') return { code: 'DECISION_NOT_ACCEPTED' };
    const provenance = await manager.getRepository(DecisionAvailabilityEvidence).findOneBy({ decisionId: decision.id });
    if (provenance?.semantics !== remainingSemantics) return { code: 'LEGACY_DECISION' };
    const { employeeId, skillId, weekStart } = decision.snapshot;
    const lock = { mode: 'pessimistic_write' } as const;
    if (weekStart < getAvailabilityWeek().weekStart) return { code: 'STALE_ALLOCATION' };
    const employee = await manager.getRepository(Employee).findOne({ where: { id: employeeId }, lock });
    if (!employee) return { code: 'STALE_ALLOCATION' };
    const skill = await manager.getRepository(EmployeeSkill).findOne({ where: { employeeId, skillId }, lock });
    if (!skill) return { code: 'STALE_ALLOCATION' };
    const capacity = await this.availability.forEmployee(employeeId, weekStart, manager);
    const appliedAt = new Date();
    if (weekStart < getAvailabilityWeek(appliedAt).weekStart) return { code: 'STALE_ALLOCATION' };
    if (!capacity || capacity.status === 'MISSING') return { code: 'AVAILABILITY_MISSING' };
    if (capacity.status === 'OVER_ALLOCATED') return { code: 'AVAILABILITY_OVER_ALLOCATED' };
    const remaining = parseDecimalHours(capacity.remainingHoursExact);
    const support = parsePositiveSupport(provenance.supportHoursExact);
    if (!remaining || !support) throw temporarilyUnavailable(false);
    if (compareHours(support, remaining) > 0) return { code: 'INSUFFICIENT_AVAILABILITY' };
    if (capacity.remainingHoursExact !== provenance.availableHoursExact) return { code: 'STALE_ALLOCATION' };
    return { hours: provenance.supportHoursExact, appliedAt };
  }
}

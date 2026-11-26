import {
  BadRequestException, ConflictException, HttpException, Injectable, ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, type EntityManager } from 'typeorm';
import { forbidden, unauthenticated } from '../../auth/auth-policy.js';
import type { UserAccount } from '../../auth/user-account.entity.js';
import { EmployeeSkill } from '../../employee-skills/employee-skill.entity.js';
import { Employee } from '../../employees/employee.entity.js';
import { decisionKey, decisionReferenceDigest, matchesDecisionReference, verifyDecisionEvidence } from '../decision-context.js';
import { ProjectsService } from '../projects.service.js';
import type { ProjectDecisionHistoryDto } from './dto/project-decision-history.dto.js';
import type { ProjectDecisionDto } from './dto/project-decision.dto.js';
import { PMDecision, type DecisionResponse, type DecisionSnapshot } from './pm-decision.entity.js';

function invalidEvidence() {
  return new BadRequestException({
    statusCode: 400, code: 'INVALID_SIMULATION_EVIDENCE', message: 'Bằng chứng không hợp lệ. Hãy mô phỏng lại.',
  });
}

function unavailable() {
  return new ServiceUnavailableException({
    statusCode: 503, code: 'DECISION_UNAVAILABLE', message: 'Chưa thể xử lý quyết định. Vui lòng thử lại.',
  });
}

function response(row: DecisionResponse): DecisionResponse {
  const { id, simulationId, projectId, pmAccountId, decision, decidedAt, snapshot, expectedImpact } = row;
  return { id, simulationId, projectId, pmAccountId, decision, decidedAt, snapshot, expectedImpact };
}

function duplicate(error: unknown) {
  return error instanceof QueryFailedError &&
    'errno' in error.driverError && error.driverError.errno === 1062;
}

@Injectable()
export class ProjectDecisionsService {
  constructor(
    @InjectDataSource() private readonly database: DataSource,
    private readonly projects: ProjectsService,
  ) {}

  async record(projectId: string, pmAccountId: string, input: ProjectDecisionDto) {
    try {
      return await this.recordTransaction(projectId, pmAccountId, input, false);
    } catch (error) {
      if (duplicate(error)) {
        try {
          return await this.recordTransaction(projectId, pmAccountId, input, true);
        } catch (reconciliationError) {
          if (reconciliationError instanceof HttpException) throw reconciliationError;
          throw unavailable();
        }
      }
      if (error instanceof HttpException) throw error;
      throw unavailable();
    }
  }

  async history(projectId: string, pmAccountId: string, page: ProjectDecisionHistoryDto) {
    try {
      return await this.database.transaction('READ COMMITTED', async (manager) => {
        await this.authorize(manager, projectId, pmAccountId, 'pessimistic_read');
        const rows = await manager.getRepository(PMDecision).find({
          where: { projectId }, order: { decidedAt: 'DESC', id: 'DESC' },
          skip: page.offset, take: page.limit + 1,
        });
        return { items: rows.slice(0, page.limit).map(response), hasMore: rows.length > page.limit };
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw unavailable();
    }
  }

  private recordTransaction(projectId: string, pmAccountId: string, input: ProjectDecisionDto, reconcile: boolean) {
    return this.database.transaction('READ COMMITTED', async (manager) => {
      await this.authorize(manager, projectId, pmAccountId, 'pessimistic_write');
      const repository = manager.getRepository(PMDecision);
      const existing = await repository.createQueryBuilder('decision')
        .addSelect('decision.referenceDigest')
        .where('decision.projectId = :projectId AND decision.simulationId = :simulationId', {
          projectId, simulationId: input.simulationId,
        }).getOne();
      if (existing) {
        if (existing.pmAccountId !== pmAccountId) throw forbidden();
        if (!matchesDecisionReference(input.simulationToken, existing.referenceDigest)) throw invalidEvidence();
        if (existing.decision !== input.decision) {
          throw new ConflictException({
            statusCode: 409, code: 'DECISION_CONFLICT', message: 'Lượt này đã có quyết định. Hãy xem lịch sử.',
          });
        }
        return { created: false, decision: response(existing) };
      }
      if (reconcile) throw unavailable();

      const key = decisionKey();
      if (!key) throw unavailable();
      const claims = verifyDecisionEvidence(key, input.simulationToken);
      if (!claims || claims.simulationId !== input.simulationId) throw invalidEvidence();
      if (claims.pmAccountId !== pmAccountId || claims.projectId !== projectId) throw forbidden();
      await this.requireFresh(manager, claims.snapshot);

      const row = {
        id: randomUUID(), simulationId: claims.simulationId, projectId, pmAccountId,
        decision: input.decision, decidedAt: new Date(), snapshot: claims.snapshot,
        expectedImpact: claims.expectedImpact, referenceDigest: decisionReferenceDigest(input.simulationToken),
      };
      await repository.insert(row);
      return { created: true, decision: response(row) };
    });
  }

  private async authorize(
    manager: EntityManager, projectId: string, pmAccountId: string,
    lock: 'pessimistic_read' | 'pessimistic_write',
  ) {
    const [account] = await manager.query(
      'SELECT role, disabledAt FROM user_accounts WHERE id = ? LOCK IN SHARE MODE', [pmAccountId],
    ) as Pick<UserAccount, 'role' | 'disabledAt'>[];
    if (!account || account.disabledAt) throw unauthenticated();
    if (account.role !== 'PM') throw forbidden();
    await this.projects.requireOwned(projectId, pmAccountId, { manager, lock });
  }

  private async requireFresh(manager: EntityManager, snapshot: DecisionSnapshot) {
    const lock = { mode: 'pessimistic_write' } as const;
    const employee = await manager.getRepository(Employee).findOne({ where: { id: snapshot.employeeId }, lock });
    const skillLink = employee && await manager.getRepository(EmployeeSkill).findOne({
      where: { employeeId: snapshot.employeeId, skillId: snapshot.skillId }, lock,
    });
    if (!employee || !skillLink || employee.availabilityWeekStart !== snapshot.weekStart ||
        employee.availableHours !== snapshot.availableHours) {
      throw new ConflictException({
        statusCode: 409, code: 'STALE_SIMULATION', message: 'Dữ liệu đã thay đổi. Hãy mô phỏng lại.',
      });
    }
  }
}

import { randomUUID } from 'node:crypto';
import { QueryFailedError } from 'typeorm';
import { Employee } from '../src/employees/employee.entity.js';
import { getAvailabilityWeek } from '../src/employees/availability-week.js';
import { EmployeeSkill } from '../src/employee-skills/employee-skill.entity.js';
import { ProjectAllocation } from '../src/projects/allocations/project-allocation.entity.js';
import { ApplicationResult } from '../src/projects/allocations/application-result.entity.js';
import { PMDecision } from '../src/projects/decisions/pm-decision.entity.js';
import { DecisionAvailabilityEvidence } from '../src/projects/decisions/decision-availability-evidence.entity.js';
import { openAuthApp } from './auth-http-fixture.js';
import { fixtureCookie, pmId, testOrigin } from './auth-test-fixtures.js';

export async function allocationHttpFixture() {
  const projectId = randomUUID();
  const employeeId = randomUUID();
  const decisionId = randomUUID();
  const skillId = randomUUID();
  const weekStart = getAvailabilityWeek().weekStart;
  const employee = { id: employeeId, availabilityWeekStart: weekStart, availableHours: 3 };
  const input = {
    id: decisionId, projectId, pmAccountId: pmId, decision: 'ACCEPT',
    snapshot: { employeeId, skillId, weekStart },
  };
  const provenance = {
    decisionId, semantics: 'remaining-v1', supportHoursExact: '1e0', availableHoursExact: '3e0',
  };
  const allocations: ProjectAllocation[] = [];
  const results: ApplicationResult[] = [];
  const fault = { provenance: false, linked: true, insert: false, commit: false, duplicate: false };
  let competingAllocation: ProjectAllocation | undefined;
  const app = await openAuthApp(false, (entity) => {
    if (entity === Employee) return { findOne: async () => employee };
    if (entity === EmployeeSkill) return { findOne: async () => fault.linked ? { employeeId, skillId } : null };
    if (entity === PMDecision) return { findOneBy: async ({ id, projectId: scope }: { id: string; projectId: string }) =>
      id === decisionId && scope === projectId ? input : null };
    if (entity === DecisionAvailabilityEvidence) return { findOneBy: async () => fault.provenance ? null : provenance };
    if (entity === ProjectAllocation) return {
      create: (row: ProjectAllocation) => row,
      insert: async (row: ProjectAllocation) => {
        if (fault.duplicate) {
          competingAllocation = row;
          throw new QueryFailedError('INSERT', [], Object.assign(new Error('Fixture duplicate'), { errno: 1062 }));
        }
        allocations.push(row);
      },
      findOneBy: async () => allocations[0],
    };
    if (entity === ApplicationResult) return {
      insert: async (row: ApplicationResult) => {
        if (fault.insert) throw new Error('Fixture failure between inserts');
        results.push(row);
      },
      findOne: async () => results.findLast(row => row.outcome === 'FAILED') ?? null,
      createQueryBuilder() {
        let offset = 0;
        let limit = 21;
        const builder = {
          innerJoinAndSelect: () => builder, leftJoinAndSelect: () => builder,
          orderBy: () => builder, addOrderBy: () => builder,
          skip: (n: number) => { offset = n; return builder; },
          take: (n: number) => { limit = n; return builder; },
          getMany: async () => [...results].reverse().slice(offset, offset + limit).map(row => ({
            ...row, decision: input, allocation: allocations.find(item => item.id === row.allocationId) ?? null,
          })),
        };
        return builder;
      },
    };
    return undefined;
  }, (runner) => {
    let before: [number, number] = [0, 0];
    return Object.assign(runner, {
      connect: async () => undefined,
      startTransaction: async (isolation: string) => {
        expect(isolation).toBe('READ COMMITTED');
        before = [allocations.length, results.length];
        runner.isTransactionActive = true;
      },
      commitTransaction: async () => {
        runner.isTransactionActive = false;
        if (fault.commit) throw new Error('Fixture connection lost after commit');
      },
      rollbackTransaction: async () => {
        allocations.length = before[0];
        results.length = before[1];
        if (competingAllocation) {
          allocations.push(competingAllocation);
          competingAllocation = undefined;
        }
        runner.isTransactionActive = false;
      },
      release: async () => { runner.isReleased = true; },
    });
  });
  app.projects.set(projectId, { id: projectId, pmAccountId: pmId, name: 'Fixture 006', sprints: [] });
  const path = `/projects/${projectId}/decisions/${decisionId}/apply`;
  const send = (actor = pmId, body = {}) => app.client.post(path).set('Cookie', fixtureCookie(actor))
    .set('Origin', testOrigin).send(body);
  const read = (actor = pmId) => app.client.get(path).set('Cookie', fixtureCookie(actor));
  return { ...app, send, read, path, employee, fault, projectId, decisionId, allocations, results };
}

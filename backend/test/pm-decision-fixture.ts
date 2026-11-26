import { randomUUID } from 'node:crypto';
import { QueryFailedError } from 'typeorm';
import { EmployeeSkill } from '../src/employee-skills/employee-skill.entity.js';
import { Employee } from '../src/employees/employee.entity.js';
import { issueDecisionEvidence } from '../src/projects/decision-context.js';
import { PMDecision, type DecisionChoice } from '../src/projects/decisions/pm-decision.entity.js';
import { openAuthApp } from './auth-http-fixture.js';
import { fixtureCookie, pmId, secondPmId, testOrigin } from './auth-test-fixtures.js';

export async function pmDecisionFixture() {
  const key = Buffer.alloc(32, 42);
  vi.stubEnv('WHAT_IF_DECISION_SIGNING_KEY', key.toString('base64url'));
  const projectId = randomUUID();
  const otherProject = randomUUID();
  const unmapped = randomUUID();
  const employee = { id: randomUUID(), availabilityWeekStart: '2026-11-16', availableHours: 3 };
  const skillId = randomUUID();
  const source = { linked: true, failInsert: false, failHistory: false, mockUniqueRace: false };
  const rows: Omit<PMDecision, 'project' | 'pmAccount'>[] = [];
  const repository = {
    createQueryBuilder() {
      let scope: { projectId: string; simulationId: string };
      return {
        addSelect() { return this; },
        where(_sql: string, args: typeof scope) { scope = args; return this; },
        async getOne() {
          return rows.find((row) => row.projectId === scope.projectId && row.simulationId === scope.simulationId);
        },
      };
    },
    async insert(row: typeof rows[number]) {
      if (source.failInsert) throw new Error('DB write failed');
      if (source.mockUniqueRace) {
        source.mockUniqueRace = false;
        rows.push(row); // Represents a commit by the other transaction.
        throw new QueryFailedError('INSERT', [], Object.assign(new Error('Duplicate'), { errno: 1062 }));
      }
      rows.push(row);
    },
    async find({ where, take, skip }: { where: { projectId: string }; take: number; skip: number }) {
      if (source.failHistory) throw new Error('DB read failed');
      return rows.filter((row) => row.projectId === where.projectId)
        .sort((a, b) => b.decidedAt.getTime() - a.decidedAt.getTime() || b.id.localeCompare(a.id))
        .slice(skip, skip + take);
    },
  };
  const app = await openAuthApp(false, (entity) => {
    if (entity === PMDecision) return repository;
    if (entity === Employee) return { findOne: async () => ({ ...employee }) };
    if (entity === EmployeeSkill) return { findOne: async () => source.linked ? { employeeId: employee.id, skillId } : null };
    return undefined;
  });
  for (const [id, owner] of [[projectId, pmId], [otherProject, secondPmId], [unmapped, null]] as const) {
    app.projects.set(id, { id, name: 'Project fixture', pmAccountId: owner, sprints: [] });
  }
  const evidence = (actor = pmId, id = projectId) => issueDecisionEvidence(key, actor, {
    snapshot: { projectId: id, employeeId: employee.id, skillId, weekStart: '2026-11-16',
      requiredHours: 3, availableHours: 3, supportHours: 1 },
    expectedImpact: { hypotheticalSupportHours: 1, remainingRequiredHours: 2, remainingAvailableHours: 2 },
  });
  const path = (id = projectId) => `/projects/${id}/decisions`;
  const send = (
    input: Record<string, unknown>, actor = pmId, id = projectId, origin = testOrigin,
  ) => app.client.post(path(id)).set('Cookie', fixtureCookie(actor)).set('Origin', origin).send(input);
  const read = (actor = pmId, id = projectId, query = '') =>
    app.client.get(path(id) + query).set('Cookie', fixtureCookie(actor));
  const decide = (decision: DecisionChoice = 'ACCEPT') => ({ ...evidence(), decision });
  return { ...app, rows, employee, source, evidence, send, read, decide, path, projectId, otherProject, unmapped };
}

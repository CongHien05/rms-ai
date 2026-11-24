import { randomUUID } from 'node:crypto';
import { NotFoundException } from '@nestjs/common';
import type { EmployeesService } from '../employees/employees.service.js';
import type { SkillsService } from '../skills/skills.service.js';
import type { ProjectsService } from './projects.service.js';
import { calculateSimulationImpact } from './project-hours.js';
import { ProjectSimulationService } from './project-simulation.service.js';
import {
  issueRecommendationProof,
  verifyRecommendationProof,
} from './recommendation-context.js';

describe('What-if calculation', () => {
  it.each([
    [8, 8, 12.5, 0, 4.5],
    [8, 4, 4, 4, 0],
    [8, 9, 12.5, 0, 3.5],
    [0.3, 0.1, 0.3, 0.2, 0.2],
    [3e-7, 1e-7, 3e-7, 2e-7, 2e-7],
    [1e21, 2e21, 3e21, 0, 1e21],
  ])(
    'calculates hours for required=%s support=%s available=%s',
    (required, support, available, missing, remaining) => {
      expect(calculateSimulationImpact(required, support, available)).toEqual({
        hypotheticalSupportHours: support,
        remainingRequiredHours: missing,
        remainingAvailableHours: remaining,
      });
    },
  );

  it('rejects the next representable hours above availability without rounding', () => {
    expect(calculateSimulationImpact(1, 1 + Number.EPSILON, 1)).toBeNull();
    expect(calculateSimulationImpact(1, 0.30000000000000004, 0.3)).toBeNull();
    expect(
      calculateSimulationImpact(
        Number.MIN_VALUE,
        Number.MIN_VALUE,
        Number.MIN_VALUE,
      ),
    ).toEqual({
      hypotheticalSupportHours: Number.MIN_VALUE,
      remainingRequiredHours: 0,
      remainingAvailableHours: 0,
    });
  });
});

describe('ProjectSimulationService', () => {
  const key = Buffer.alloc(32, 17);
  const context = {
    projectId: randomUUID(),
    employeeId: randomUUID(),
    skillId: randomUUID(),
    weekStart: '2026-11-16',
    requiredHours: 8,
  };
  const input = {
    runId: randomUUID(),
    scenario: {
      ...context,
      supportHours: 6,
      recommendationContext: issueRecommendationProof(key, context),
    },
  };
  const source = {
    weekStart: context.weekStart,
    availableHours: 8,
    matchesSkill: true,
  };
  const projects = { findOne: vi.fn() };
  const skills = { findOne: vi.fn() };
  const employees = { findSimulationAvailability: vi.fn() };
  const service = new ProjectSimulationService(
    projects as unknown as ProjectsService,
    skills as unknown as SkillsService,
    employees as unknown as EmployeesService,
  );

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('WHAT_IF_CONTEXT_SECRET', key.toString('base64url'));
    employees.findSimulationAvailability.mockResolvedValue(source);
  });
  afterEach(() => vi.unstubAllEnvs());

  it('canonicalizes UUIDs and checks the version, signature length and every field', () => {
    const proof = input.scenario.recommendationContext;
    expect(
      verifyRecommendationProof(
        key,
        { ...context, projectId: context.projectId.toUpperCase() },
        proof,
      ),
    ).toBe(true);
    for (const altered of [
      { projectId: randomUUID() },
      { employeeId: randomUUID() },
      { skillId: randomUUID() },
      { requiredHours: 9 },
      { weekStart: '2026-11-23' },
    ])
      expect(
        verifyRecommendationProof(key, { ...context, ...altered }, proof),
      ).toBe(false);
    for (const altered of [
      'v2' + proof.slice(2),
      proof.slice(0, -1),
      'v1.' + 'A'.repeat(43),
    ]) {
      expect(verifyRecommendationProof(key, context, altered)).toBe(false);
    }
  });

  it.each([0, -1, undefined, NaN, Infinity, -Infinity])(
    'rejects unsupported hours %s before reading',
    async (supportHours) => {
      await expect(
        service.simulate(context.projectId, {
          ...input,
          scenario: { ...input.scenario, supportHours: supportHours as number },
        }),
      ).rejects.toMatchObject({
        status: 400,
        response: { code: 'INVALID_SCENARIO' },
      });
      expect(employees.findSimulationAvailability).not.toHaveBeenCalled();
    },
  );

  it.each([
    [{ availableHours: null }, 422, 'MISSING_AVAILABILITY'],
    [{ weekStart: '2026-11-09' }, 422, 'MISSING_AVAILABILITY'],
    [{ weekStart: null }, 422, 'MISSING_AVAILABILITY'],
    [{ availableHours: 0 }, 400, 'INVALID_SCENARIO'],
    [{ matchesSkill: false }, 400, 'INVALID_SCENARIO'],
  ])(
    'classifies source %j without returning impact',
    async (difference, status, code) => {
      employees.findSimulationAvailability.mockResolvedValue({
        ...source,
        ...difference,
      });
      await expect(
        service.simulate(context.projectId, input),
      ).rejects.toMatchObject({ status, response: { code } });
    },
  );

  it.each(['project', 'employee', 'skill'])(
    'reports a removed %s as an invalid scenario',
    async (reference) => {
      const lookup =
        reference === 'project'
          ? projects.findOne
          : reference === 'skill'
            ? skills.findOne
            : employees.findSimulationAvailability;
      lookup.mockRejectedValue(new NotFoundException('record missing'));
      await expect(
        service.simulate(context.projectId, input),
      ).rejects.toMatchObject({
        status: 404,
        response: { code: 'INVALID_SCENARIO' },
      });
    },
  );

  it('rejects a different project or week before querying the source', async () => {
    await expect(service.simulate(randomUUID(), input)).rejects.toMatchObject({
      status: 400,
    });
    await expect(
      service.simulate(context.projectId, {
        ...input,
        scenario: { ...input.scenario, weekStart: '2026-11-17' },
      }),
    ).rejects.toMatchObject({ status: 400 });
    expect(projects.findOne).not.toHaveBeenCalled();
  });

  it('checks changed availability, retries independently and returns the new snapshot', async () => {
    const first = await service.simulate(context.projectId, input);
    employees.findSimulationAvailability.mockResolvedValue({
      ...source,
      availableHours: 4,
    });
    await expect(
      service.simulate(context.projectId, input),
    ).rejects.toMatchObject({ status: 400 });
    const retry = {
      ...input,
      runId: randomUUID(),
      scenario: { ...input.scenario, supportHours: 4 },
    };
    const second = await service.simulate(context.projectId, retry);
    expect(second).toMatchObject({
      runId: retry.runId,
      snapshot: { ...context, supportHours: 4, availableHours: 4 },
      expectedImpact: {
        hypotheticalSupportHours: 4,
        remainingRequiredHours: 4,
        remainingAvailableHours: 0,
      },
    });
    expect(second.scenarioReference).not.toBe(first.scenarioReference);
    employees.findSimulationAvailability.mockResolvedValue({
      ...source,
      availableHours: 7,
    });
    const third = await service.simulate(context.projectId, {
      ...retry,
      runId: randomUUID(),
    });
    expect(third.snapshot.availableHours).toBe(7);
    expect(third.scenarioReference).toBe(second.scenarioReference);
    expect(third.runId).not.toBe(second.runId);
    expect(employees.findSimulationAvailability).toHaveBeenCalledTimes(4);
  });

  it('hides source failures and permits retry once it recovers', async () => {
    employees.findSimulationAvailability.mockRejectedValueOnce(
      new Error('DB internals'),
    );
    await expect(
      service.simulate(context.projectId, input),
    ).rejects.toMatchObject({
      status: 503,
      response: {
        code: 'SIMULATION_UNAVAILABLE',
        message: 'Chưa thể mô phỏng. Vui lòng thử lại.',
      },
    });
    await expect(
      service.simulate(context.projectId, { ...input, runId: randomUUID() }),
    ).resolves.toMatchObject({ outcome: 'available' });
  });

  it('is unavailable without a canonical local key and rejects invalid source hours', async () => {
    vi.stubEnv('WHAT_IF_CONTEXT_SECRET', key.toString('base64url') + '=');
    await expect(
      service.simulate(context.projectId, input),
    ).rejects.toMatchObject({ status: 503 });
    vi.stubEnv('WHAT_IF_CONTEXT_SECRET', key.toString('base64url'));
    employees.findSimulationAvailability.mockResolvedValue({
      ...source,
      availableHours: -1,
    });
    await expect(
      service.simulate(context.projectId, input),
    ).rejects.toMatchObject({ status: 500 });
  });
});

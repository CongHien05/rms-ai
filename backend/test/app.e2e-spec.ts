import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { App } from 'supertest/types';
import { configureApp } from '../src/app-config.js';
import { AuthSession } from '../src/auth/auth-session.entity.js';
import { baselineRequest, configureAuthTestEnv, createAuthFixture, pmId } from './auth-test-fixtures.js';
import { AppModule } from './../src/app.module.js';
import { EmployeeSkill } from './../src/employee-skills/employee-skill.entity.js';
import { getAvailabilityWeek } from './../src/employees/availability-week.js';
import { Employee } from './../src/employees/employee.entity.js';
import { assessmentDateInVietnam } from './../src/projects/project-risk.service.js';
import { Project } from './../src/projects/project.entity.js';
import { Skill } from './../src/skills/skill.entity.js';
import { Sprint } from './../src/sprints/sprint.entity.js';
import { TaskStatus } from './../src/tasks/task-status.enum.js';
import { Task } from './../src/tasks/task.entity.js';

function employeeSkillKey(employeeId: string, skillId: string): string {
  return `${employeeId}:${skillId}`;
}

describe('Backend foundations (e2e)', () => {
  let app: INestApplication<App>;
  let projects: Map<string, Project>;
  let sprints: Map<string, Sprint>;
  let tasks: Map<string, Task>;
  let employees: Map<string, Employee>;
  let skills: Map<string, Skill>;
  let employeeSkills: Map<string, EmployeeSkill>;
  let employeeRead: ReturnType<typeof vi.fn>;
  let resourceWrites: ReturnType<typeof vi.fn>[];

  beforeEach(async () => {
    configureAuthTestEnv();
    const auth = createAuthFixture();
    process.env.DB_HOST = 'test-host';
    process.env.DB_PORT = '3306';
    process.env.DB_USERNAME = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_DATABASE = 'test-database';
    vi.stubEnv('WHAT_IF_CONTEXT_SECRET', undefined);

    projects = new Map();
    sprints = new Map();
    tasks = new Map();
    employees = new Map();
    skills = new Map();
    employeeSkills = new Map();

    const projectRepository = {
      create: vi.fn((input: Pick<Project, 'name'>) => ({
        id: randomUUID(),
        ...input,
      })),
      save: vi.fn(async (project: Project) => {
        projects.set(project.id, project);
        return project;
      }),
      findBy: vi.fn(async ({ pmAccountId }: { pmAccountId: string }) =>
        [...projects.values()].filter((project) => project.pmAccountId === pmAccountId)),
      findOneBy: vi.fn(
        async ({ id }: { id: string }) => projects.get(id) ?? null,
      ),
    };

    const sprintRepository = {
      create: vi.fn((input: Pick<Sprint, 'projectId' | 'name'>) => ({
        id: randomUUID(),
        ...input,
      })),
      save: vi.fn(async (sprint: Sprint) => {
        sprints.set(sprint.id, sprint);
        return sprint;
      }),
      findBy: vi.fn(async ({ projectId }: { projectId: string }) =>
        [...sprints.values()].filter(
          (sprint) => sprint.projectId === projectId,
        ),
      ),
      findOneBy: vi.fn(
        async ({ id }: { id: string }) => sprints.get(id) ?? null,
      ),
    };

    const taskRepository = {
      find: vi.fn(
        async ({ where }: { where: { sprint: { projectId: string } } }) =>
          [...tasks.values()].filter(
            (task) =>
              sprints.get(task.sprintId)?.projectId === where.sprint.projectId,
          ),
      ),
      create: vi.fn(
        (input: Partial<Task> & Pick<Task, 'sprintId' | 'title'>) => ({
          id: randomUUID(),
          status: TaskStatus.TODO,
          ...input,
        }),
      ),
      save: vi.fn(async (task: Task) => {
        tasks.set(task.id, task);
        return task;
      }),
      findBy: vi.fn(async ({ sprintId }: { sprintId: string }) =>
        [...tasks.values()].filter((task) => task.sprintId === sprintId),
      ),
      findOneBy: vi.fn(
        async ({ id, sprintId }: { id: string; sprintId?: string }) => {
          const task = tasks.get(id);
          if (!task) return null;
          if (sprintId && task.sprintId !== sprintId) return null;
          return task;
        },
      ),
    };

    employeeRead = vi.fn(async ({ where: { id } }: { where: { id: string } }) => {
      const employee = employees.get(id);
      return employee ? {
        ...employee,
        employeeSkills: [...employeeSkills.values()].filter((link) => link.employeeId === id),
      } : null;
    });
    const employeeRepository = {
      create: vi.fn((input: Pick<Employee, 'displayName'>) => ({
        id: randomUUID(),
        ...input,
      })),
      save: vi.fn(async (employee: Employee) => {
        employees.set(employee.id, employee);
        return employee;
      }),
      find: vi.fn(
        async (options?: {
          relations?: unknown;
          where?: { employeeSkills: { skillId: string } };
        }) => {
          const roster = [...employees.values()];
          if (options?.where) {
            const { employeeSkills: { skillId } } = options.where;
            return roster.filter(
              (employee) =>
                employeeSkills.has(employeeSkillKey(employee.id, skillId)),
            );
          }
          return roster.map((employee) =>
            options?.relations
              ? {
                  ...employee,
                  employeeSkills: [...employeeSkills.values()]
                    .filter((link) => link.employeeId === employee.id)
                    .map((link) => ({
                      ...link,
                      skill: skills.get(link.skillId),
                    })),
                }
              : employee,
          );
        },
      ),
      findOneBy: vi.fn(
        async ({ id }: { id: string }) => employees.get(id) ?? null,
      ),
      findOne: employeeRead,
    };

    const skillRepository = {
      create: vi.fn((input: Pick<Skill, 'name'>) => ({
        id: randomUUID(),
        ...input,
      })),
      save: vi.fn(async (skill: Skill) => {
        skills.set(skill.id, skill);
        return skill;
      }),
      find: vi.fn(async () => [...skills.values()]),
      findOneBy: vi.fn(
        async ({ id }: { id: string }) => skills.get(id) ?? null,
      ),
    };

    const employeeSkillRepository = {
      create: vi.fn(
        (input: Pick<EmployeeSkill, 'employeeId' | 'skillId'>) => input,
      ),
      save: vi.fn(async (employeeSkill: EmployeeSkill) => {
        employeeSkills.set(
          employeeSkillKey(employeeSkill.employeeId, employeeSkill.skillId),
          employeeSkill,
        );
        return employeeSkill;
      }),
      findOneBy: vi.fn(
        async ({ employeeId, skillId }: EmployeeSkill) =>
          employeeSkills.get(employeeSkillKey(employeeId, skillId)) ?? null,
      ),
      find: vi.fn(
        async ({ where: { employeeId } }: { where: { employeeId: string } }) =>
          [...employeeSkills.values()]
            .filter((relation) => relation.employeeId === employeeId)
            .map((relation) => ({
              ...relation,
              skill: skills.get(relation.skillId) as Skill,
            })),
      ),
    };

    resourceWrites = [projectRepository.save, employeeRepository.save, skillRepository.save, employeeSkillRepository.save];

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getDataSourceToken())
      .useValue({ manager: {}, isInitialized: false })
      .overrideProvider(getRepositoryToken(AuthSession))
      .useValue(auth.sessionsRepository)
      .overrideProvider(getRepositoryToken(Project))
      .useValue(projectRepository)
      .overrideProvider(getRepositoryToken(Sprint))
      .useValue(sprintRepository)
      .overrideProvider(getRepositoryToken(Task))
      .useValue(taskRepository)
      .overrideProvider(getRepositoryToken(Employee))
      .useValue(employeeRepository)
      .overrideProvider(getRepositoryToken(Skill))
      .useValue(skillRepository)
      .overrideProvider(getRepositoryToken(EmployeeSkill))
      .useValue(employeeSkillRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/health (GET)', () => {
    return baselineRequest(app)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('creates and lists the Project -> Sprint -> Task foundation', async () => {
    const projectResponse = await baselineRequest(app)
      .post('/projects')
      .send({ name: '  Project Alpha  ' })
      .expect(201);
    expect(projectResponse.body).toMatchObject({ name: 'Project Alpha' });

    const sprintResponse = await baselineRequest(app)
      .post(`/projects/${projectResponse.body.id}/sprints`)
      .send({ name: '  Sprint 1  ' })
      .expect(201);
    expect(sprintResponse.body).toMatchObject({
      projectId: projectResponse.body.id,
      name: 'Sprint 1',
    });

    const taskResponse = await baselineRequest(app)
      .post(`/sprints/${sprintResponse.body.id}/tasks`)
      .send({
        title: '  Task 1  ',
        dueDate: '2026-12-01',
        estimatedHours: 3.5,
      })
      .expect(201);
    expect(taskResponse.body).toMatchObject({
      sprintId: sprintResponse.body.id,
      title: 'Task 1',
      status: 'TODO',
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    });

    const updatedTask = await baselineRequest(app)
      .patch(`/sprints/${sprintResponse.body.id}/tasks/${taskResponse.body.id}`)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);
    expect(updatedTask.body).toMatchObject({
      id: taskResponse.body.id,
      sprintId: sprintResponse.body.id,
      title: 'Task 1',
      status: 'IN_PROGRESS',
      dueDate: '2026-12-01',
      estimatedHours: 3.5,
    });

    const clearedEstimate = await baselineRequest(app)
      .patch(`/sprints/${sprintResponse.body.id}/tasks/${taskResponse.body.id}`)
      .send({ estimatedHours: null })
      .expect(200);
    expect(clearedEstimate.body).toMatchObject({
      status: 'IN_PROGRESS',
      dueDate: '2026-12-01',
      estimatedHours: null,
    });

    const clearedDueDate = await baselineRequest(app)
      .patch(`/sprints/${sprintResponse.body.id}/tasks/${taskResponse.body.id}`)
      .send({ dueDate: null })
      .expect(200);
    expect(clearedDueDate.body).toMatchObject({
      status: 'IN_PROGRESS',
      dueDate: null,
      estimatedHours: null,
    });

    await baselineRequest(app)
      .get('/projects')
      .expect(200)
      .expect([{ id: projectResponse.body.id, name: 'Project Alpha' }]);
    await baselineRequest(app)
      .get(`/projects/${projectResponse.body.id}`)
      .expect(200)
      .expect({ id: projectResponse.body.id, name: 'Project Alpha' });
    await baselineRequest(app)
      .get(`/projects/${projectResponse.body.id}/sprints`)
      .expect(200)
      .expect([
        {
          id: sprintResponse.body.id,
          projectId: projectResponse.body.id,
          name: 'Sprint 1',
        },
      ]);
    await baselineRequest(app)
      .get(`/sprints/${sprintResponse.body.id}/tasks`)
      .expect(200)
      .expect([
        {
          id: taskResponse.body.id,
          sprintId: sprintResponse.body.id,
          title: 'Task 1',
          status: 'IN_PROGRESS',
          dueDate: null,
          estimatedHours: null,
        },
      ]);
  });

  it('rejects invalid input and unknown parents', async () => {
    await baselineRequest(app)
      .post('/projects')
      .send({ name: '   ' })
      .expect(400);
    await baselineRequest(app).get('/projects/not-a-uuid').expect(400);
    await baselineRequest(app)
      .get(`/projects/${randomUUID()}`)
      .expect(404);
    await baselineRequest(app)
      .post(`/projects/${randomUUID()}/sprints`)
      .send({ name: 'Sprint 1' })
      .expect(404);
    await baselineRequest(app)
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1' })
      .expect(404);
    await baselineRequest(app)
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', dueDate: '2026-02-30' })
      .expect(400);
    await baselineRequest(app)
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', dueDate: '30-12-2026' })
      .expect(400);
    await baselineRequest(app)
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', estimatedHours: 0 })
      .expect(400);
    await baselineRequest(app)
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', estimatedHours: '3.5' })
      .expect(400);
    await baselineRequest(app)
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .send({ status: 'INVALID_STATUS' })
      .expect(400);
    await baselineRequest(app)
      .patch(`/sprints/${randomUUID()}/tasks/not-a-uuid`)
      .send({ status: 'DONE' })
      .expect(400);
    await baselineRequest(app)
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .send({ status: 'DONE' })
      .expect(404);
    await baselineRequest(app)
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .send({ status: null })
      .expect(400);
    await baselineRequest(app)
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .set('Content-Type', 'application/json')
      .send('{"estimatedHours":1e309}')
      .expect(400);
  });

  it('rejects updating task with a different sprint ID and preserves original task data', async () => {
    const projectResponse = await baselineRequest(app)
      .post('/projects')
      .send({ name: 'Project Beta' })
      .expect(201);

    const sprint1 = await baselineRequest(app)
      .post(`/projects/${projectResponse.body.id}/sprints`)
      .send({ name: 'Sprint 1' })
      .expect(201);

    const sprint2 = await baselineRequest(app)
      .post(`/projects/${projectResponse.body.id}/sprints`)
      .send({ name: 'Sprint 2' })
      .expect(201);

    const task1 = await baselineRequest(app)
      .post(`/sprints/${sprint1.body.id}/tasks`)
      .send({ title: 'Task in Sprint 1' })
      .expect(201);
    expect(task1.body.status).toBe('TODO');
    expect(task1.body).toMatchObject({
      dueDate: null,
      estimatedHours: null,
    });

    // Attempt to update task1 using sprint2 ID
    await baselineRequest(app)
      .patch(`/sprints/${sprint2.body.id}/tasks/${task1.body.id}`)
      .send({ status: 'DONE' })
      .expect(404);
    await baselineRequest(app)
      .patch(`/sprints/${sprint2.body.id}/tasks/${task1.body.id}`)
      .send({ dueDate: '2026-12-20', estimatedHours: 8.25 })
      .expect(404);

    await baselineRequest(app)
      .patch(`/sprints/${sprint1.body.id}/tasks/${task1.body.id}/status`)
      .send({ status: 'DONE' })
      .expect(404);
    await baselineRequest(app)
      .patch(`/tasks/${task1.body.id}`)
      .send({ status: 'DONE' })
      .expect(404);
    await baselineRequest(app)
      .patch(`/tasks/${task1.body.id}/status`)
      .send({ status: 'DONE' })
      .expect(404);

    // Verify task1 in sprint1 remains unchanged with status 'TODO'
    const sprint1Tasks = await baselineRequest(app)
      .get(`/sprints/${sprint1.body.id}/tasks`)
      .expect(200);
    expect(sprint1Tasks.body).toHaveLength(1);
    expect(sprint1Tasks.body[0]).toMatchObject({
      id: task1.body.id,
      sprintId: sprint1.body.id,
      title: 'Task in Sprint 1',
      status: 'TODO',
      dueDate: null,
      estimatedHours: null,
    });

    // Verify sprint2 still has no tasks
    const sprint2Tasks = await baselineRequest(app)
      .get(`/sprints/${sprint2.body.id}/tasks`)
      .expect(200);
    expect(sprint2Tasks.body).toHaveLength(0);
  });

  it('assesses only tasks in the project and supplies the current Vietnam date', async () => {
    const projectA = randomUUID();
    const projectB = randomUUID();
    projects.set(projectA, { id: projectA, name: 'A', pmAccountId: pmId } as Project);
    projects.set(projectB, { id: projectB, name: 'B', pmAccountId: pmId } as Project);
    const sprintA = randomUUID();
    const anotherSprintA = randomUUID();
    const sprintB = randomUUID();
    sprints.set(sprintA, { id: sprintA, projectId: projectA } as Sprint);
    sprints.set(anotherSprintA, {
      id: anotherSprintA,
      projectId: projectA,
    } as Sprint);
    sprints.set(sprintB, { id: sprintB, projectId: projectB } as Sprint);
    const ownTasks = [
      { sprintId: sprintA, status: TaskStatus.TODO, dueDate: '2026-11-25' },
      { sprintId: anotherSprintA, status: TaskStatus.DONE, dueDate: null },
    ];
    for (const task of [
      ...ownTasks,
      { sprintId: sprintB, status: TaskStatus.BLOCKED, dueDate: null },
    ]) {
      const id = randomUUID();
      tasks.set(id, { ...task, id } as Task);
    }
    const prediction = {
      projectId: projectA,
      status: 'scored',
      probability: 0.4,
      modelVersion: 'test',
      eligibleTaskCount: 1,
      openTasksMissingDeadline: 0,
    };
    const predict = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json(prediction));
    try {
      const dateBefore = assessmentDateInVietnam(new Date());
      const result = await baselineRequest(app)
        .post(`/projects/${projectA}/risk-assessments`)
        .send({ assessmentDate: '2020-01-01' })
        .expect(200);
      const dateAfter = assessmentDateInVietnam(new Date());
      expect([dateBefore, dateAfter]).toContain(result.body.assessmentDate);
      expect(result.body).toEqual({
        ...prediction,
        assessmentDate: result.body.assessmentDate,
      });
      expect(predict).toHaveBeenCalledOnce();
      expect(predict.mock.calls[0][0]).toMatch(/\/risk\/predict$/);
      expect(JSON.parse(String(predict.mock.calls[0][1]?.body))).toEqual({
        projectId: projectA,
        assessmentDate: result.body.assessmentDate,
        tasks: ownTasks.map(({ status, dueDate }) => ({ status, dueDate })),
      });
      await baselineRequest(app)
        .post(`/projects/${randomUUID()}/risk-assessments`)
        .expect(404);
      expect(predict).toHaveBeenCalledOnce();
    } finally {
      predict.mockRestore();
    }
  });

  it('reads HR availability with skills and distinguishes zero, missing and other-week data', async () => {
    const { weekStart, weekEnd } = getAvailabilityWeek();
    const skillId = randomUUID();
    skills.set(skillId, { id: skillId, name: 'TypeScript' } as Skill);
    const roster = [
      {
        displayName: 'Zero',
        availabilityWeekStart: weekStart,
        availableHours: 0,
      },
      {
        displayName: 'Missing',
        availabilityWeekStart: null,
        availableHours: null,
      },
      {
        displayName: 'Other week',
        availabilityWeekStart: '2025-01-06',
        availableHours: 4.5,
      },
    ];
    for (const person of roster) {
      const id = randomUUID();
      employees.set(id, { ...person, id } as Employee);
      employeeSkills.set(employeeSkillKey(id, skillId), {
        employeeId: id,
        skillId,
      } as EmployeeSkill);
    }

    const result = await baselineRequest(app)
      .get('/employees/availability')
      .expect(200);
    expect(result.body).toEqual({
      weekStart,
      weekEnd,
      employees: [...employees.values()].map((person) => ({
        id: person.id,
        displayName: person.displayName,
        skills: [{ id: skillId, name: 'TypeScript' }],
        availability:
          person.availableHours === null
            ? null
            : {
                weekStart: person.availabilityWeekStart,
                hours: person.availableHours,
              },
      })),
    });
  });

  it('returns the applicable week even when the HR directory is empty', async () => {
    await baselineRequest(app)
      .get('/employees/availability')
      .expect(200)
      .expect({ ...getAvailabilityWeek(), employees: [] });
  });

  it('ranks individual resource recommendations, filters ineligible data, and leaves availability intact', async () => {
    const projectId = randomUUID();
    const skillId = randomUUID();
    const otherSkillId = randomUUID();
    const weekStart = '2026-11-16';
    projects.set(projectId, { id: projectId, name: 'Demo project', pmAccountId: pmId });
    skills.set(skillId, { id: skillId, name: 'TypeScript' });
    skills.set(otherSkillId, { id: otherSkillId, name: 'MySQL' });
    const roster = [
      { name: 'Bình', hours: 4, week: weekStart, skill: skillId },
      { name: 'An', hours: 8, week: weekStart, skill: skillId },
      { name: 'An', hours: 12.5, week: weekStart, skill: skillId },
      { name: 'Châu', hours: 10, week: weekStart, skill: skillId },
      { name: 'Zero', hours: 0, week: weekStart, skill: skillId },
      { name: 'Undeclared', hours: null, week: null, skill: skillId },
      { name: 'Wrong week', hours: 8, week: '2026-11-09', skill: skillId },
      { name: 'Wrong skill', hours: 8, week: weekStart, skill: otherSkillId },
    ];
    const ids = roster.map((person, index) => {
      const id = `00000000-0000-4000-8000-00000000000${roster.length - index}`;
      employees.set(id, {
        id,
        displayName: person.name,
        availableHours: person.hours,
        availabilityWeekStart: person.week,
      } as Employee);
      employeeSkills.set(employeeSkillKey(id, person.skill), {
        employeeId: id,
        skillId: person.skill,
      } as EmployeeSkill);
      return id;
    });
    const before = await baselineRequest(app)
      .get('/employees/availability')
      .expect(200);
    const path = `/projects/${projectId}/resource-recommendations`;
    const requiredHours = 8;
    const result = await baselineRequest(app)
      .post(path)
      .send({ skillId, weekStart, requiredHours })
      .expect(200);
    expect(result.body).toEqual({
      projectId,
      skill: { id: skillId, name: 'TypeScript' },
      weekStart,
      requiredHours,
      outcome: 'candidates_available',
      candidates: [2, 1, 3, 0].map((index) => ({
        employeeId: ids[index],
        displayName: roster[index].name,
        availableHours: roster[index].hours,
        supportHours: index === 0 ? 4 : 8,
      })),
    });

    const empty = await baselineRequest(app)
      .post(path)
      .send({ skillId, weekStart: '2026-11-23', requiredHours })
      .expect(200);
    expect(empty.body.candidates).toEqual([]);
    expect(empty.body.outcome).toBe('unavailable');
    const after = await baselineRequest(app)
      .get('/employees/availability')
      .expect(200);
    expect(after.body.employees).toEqual(before.body.employees);
  });

  it('rejects invalid recommendation criteria and missing projects or skills', async () => {
    const projectId = randomUUID();
    const skillId = randomUUID();
    projects.set(projectId, { id: projectId, name: 'Demo project', pmAccountId: pmId });
    skills.set(skillId, { id: skillId, name: 'TypeScript' });
    const path = `/projects/${projectId}/resource-recommendations`;
    const criteria = { skillId, weekStart: '2026-11-16', requiredHours: 8 };

    for (const invalid of [
      { skillId: 'TypeScript' },
      { weekStart: '2026-11-17' },
      { weekStart: '2026-02-30' },
      { weekStart: '2026-11-16T00:00:00Z' },
      { requiredHours: 0 },
      { requiredHours: -1 },
      { requiredHours: null },
      { requiredHours: '8' },
    ]) {
      await baselineRequest(app)
        .post(path)
        .send({ ...criteria, ...invalid })
        .expect(400);
    }
    await baselineRequest(app)
      .post(path)
      .set('Content-Type', 'application/json')
      .send(
        `{"skillId":"${skillId}","weekStart":"2026-11-16","requiredHours":1e309}`,
      )
      .expect(400);
    await baselineRequest(app)
      .post(path)
      .send({ ...criteria, skillId: randomUUID() })
      .expect(404);
    await baselineRequest(app)
      .post(`/projects/${randomUUID()}/resource-recommendations`)
      .send(criteria)
      .expect(404);
  });

  function simulationFixture() {
    vi.stubEnv('WHAT_IF_CONTEXT_SECRET', Buffer.alloc(32, 23).toString('base64url'));
    const projectId = randomUUID();
    const employeeId = randomUUID();
    const skillId = randomUUID();
    const weekStart = '2026-11-16';
    const employee = {
      id: employeeId, displayName: 'What-if candidate', availableHours: 12.5, availabilityWeekStart: weekStart,
    } as Employee;
    projects.set(projectId, { id: projectId, name: 'What-if project', pmAccountId: pmId });
    skills.set(skillId, { id: skillId, name: 'TypeScript' });
    employees.set(employeeId, employee);
    employeeSkills.set(employeeSkillKey(employeeId, skillId), { employeeId, skillId } as EmployeeSkill);
    return {
      route: `/projects/${projectId}`,
      projectId, employeeId, employee, skillId, weekStart, requiredHours: 8,
    };
  }

  async function simulationRequest(fixture: ReturnType<typeof simulationFixture>) {
    const { route, skillId, weekStart, requiredHours, employeeId } = fixture;
    const result = await baselineRequest(app).post(`${route}/resource-recommendations`)
      .send({ skillId, weekStart, requiredHours }).expect(200);
    const { recommendationContext, ...candidate } = result.body.candidates[0];
    expect(result.body.outcome).toBe('candidates_available');
    expect(recommendationContext).toMatch(/^v1\.[A-Za-z0-9_-]{43}$/);
    expect(candidate).toEqual({
      employeeId, displayName: fixture.employee.displayName,
      availableHours: fixture.employee.availableHours, supportHours: Math.min(fixture.employee.availableHours!, requiredHours),
    });
    return { runId: randomUUID(), scenario: { skillId, weekStart, requiredHours, employeeId, recommendationContext, supportHours: 8 } };
  }

  function resourceSnapshot() {
    return structuredClone([[...projects], [...employees], [...skills], [...employeeSkills]]);
  }

  function expectUnchanged(before: ReturnType<typeof resourceSnapshot>) {
    expect(resourceSnapshot()).toEqual(before);
    for (const spy of resourceWrites) expect(spy).not.toHaveBeenCalled();
  }

  it('uses signed candidates and supports full, partial, decimal and over-demand hours without writes', async () => {
    const fixture = simulationFixture();
    const body = await simulationRequest(fixture);
    const before = resourceSnapshot();
    for (const [supportHours, remainingRequiredHours, remainingAvailableHours] of [
      [8, 0, 4.5], [4, 4, 8.5], [9, 0, 3.5], [0.1, 7.9, 12.4],
    ]) {
      const runId = randomUUID();
      const result = await baselineRequest(app).post(`${fixture.route}/simulations`)
        .send({ runId, scenario: { ...body.scenario, supportHours } }).expect(200);
      expect(result.body).toEqual({
        outcome: 'available', scenarioReference: expect.stringMatching(/^[a-f0-9]{64}$/), runId,
        snapshot: {
          projectId: fixture.projectId, employeeId: fixture.employeeId, skillId: fixture.skillId,
          weekStart: fixture.weekStart, requiredHours: 8, supportHours, availableHours: 12.5,
        },
        expectedImpact: { hypotheticalSupportHours: supportHours, remainingRequiredHours, remainingAvailableHours },
      });
    }
    expectUnchanged(before);
  });

  it('rejects malformed or forged DTOs before considering availability', async () => {
    const fixture = simulationFixture();
    const body = await simulationRequest(fixture);
    const before = resourceSnapshot();
    const url = `${fixture.route}/simulations`;
    for (const change of [
      { supportHours: undefined }, { supportHours: null }, { supportHours: 0 },
      { supportHours: -1 }, { supportHours: '8' }, { weekStart: '2026-11-17' },
      { weekStart: '2026-11-23' }, { employeeId: randomUUID() }, { skillId: randomUUID() },
      { availableHours: 1000 }, { expectedImpact: { remainingRequiredHours: 0 } },
      { requiredHours: 9 }, { recommendationContext: 'v1.' + 'A'.repeat(43) },
    ]) {
      await baselineRequest(app).post(url).send({ ...body, scenario: { ...body.scenario, ...change } }).expect(400);
    }
    for (const invalid of [null, [body.scenario], undefined]) {
      await baselineRequest(app).post(url).send({ ...body, scenario: invalid }).expect(400);
    }
    await baselineRequest(app).post(url).set('Content-Type', 'application/json')
      .send(JSON.stringify(body).replace('"supportHours":8', '"supportHours":1e309')).expect(400);
    await baselineRequest(app).post(`/projects/${randomUUID()}/simulations`).send(body).expect(400);
    await baselineRequest(app).post('/projects/invalid/simulations').send(body).expect(400);
    expect(employeeRead).not.toHaveBeenCalled();
    expectUnchanged(before);
  });

  it('re-reads availability and distinguishes missing or wrong-week hours from zero', async () => {
    const fixture = simulationFixture();
    const body = await simulationRequest(fixture);
    const cases = [
      { hours: 4, week: fixture.weekStart, status: 400, code: 'INVALID_SCENARIO' },
      { hours: 0, week: fixture.weekStart, status: 400, code: 'INVALID_SCENARIO' },
      { hours: null, week: fixture.weekStart, status: 422, code: 'MISSING_AVAILABILITY' },
      { hours: 12.5, week: '2026-11-09', status: 422, code: 'MISSING_AVAILABILITY' },
    ];
    for (const { hours, week, status, code } of cases) {
      fixture.employee.availableHours = hours;
      fixture.employee.availabilityWeekStart = week;
      const before = resourceSnapshot();
      const response = await baselineRequest(app).post(`${fixture.route}/simulations`).send(body).expect(status);
      expect(response.body.code).toBe(code);
      expect(response.body.expectedImpact).toBeUndefined();
      expectUnchanged(before);
    }
    fixture.employee.availableHours = 4;
    fixture.employee.availabilityWeekStart = fixture.weekStart;
    const before = resourceSnapshot();
    const result = await baselineRequest(app).post(`${fixture.route}/simulations`)
      .send({ runId: randomUUID(), scenario: { ...body.scenario, supportHours: 4 } }).expect(200);
    expect(result.body.snapshot.availableHours).toBe(4);
    expect(result.body.expectedImpact).toEqual({
      hypotheticalSupportHours: 4, remainingRequiredHours: 4, remainingAvailableHours: 0,
    });
    expectUnchanged(before);
  });

  it('retains recommendation without a key and distinguishes unavailable from empty', async () => {
    const fixture = simulationFixture();
    const body = await simulationRequest(fixture);
    vi.stubEnv('WHAT_IF_CONTEXT_SECRET', undefined);
    const before = resourceSnapshot();
    const { skillId, weekStart, requiredHours } = fixture;
    const propose = () => baselineRequest(app).post(`${fixture.route}/resource-recommendations`)
      .send({ skillId, weekStart, requiredHours });
    const result = await propose().expect(200);
    expect(result.body.outcome).toBe('candidates_available');
    expect(result.body.candidates[0].recommendationContext).toBeUndefined();
    const error = await baselineRequest(app).post(`${fixture.route}/simulations`).send(body).expect(503);
    expect(error.body.code).toBe('SIMULATION_UNAVAILABLE');
    expectUnchanged(before);
    fixture.employee.availableHours = null;
    expect((await propose().expect(200)).body).toMatchObject({ outcome: 'unavailable', candidates: [] });
    fixture.employee.availableHours = 0;
    expect((await propose().expect(200)).body).toMatchObject({ outcome: 'no_suitable_candidate', candidates: [] });
  });

  it('reports an unavailable source and permits retry for the same signed scenario', async () => {
    const fixture = simulationFixture();
    const body = await simulationRequest(fixture);
    const before = resourceSnapshot();
    employeeRead.mockRejectedValueOnce(new Error('DB internals'));
    const url = `${fixture.route}/simulations`;
    const failure = await baselineRequest(app).post(url).send(body).expect(503);
    expect(failure.body).toEqual({ statusCode: 503, code: 'SIMULATION_UNAVAILABLE', message: 'Chưa thể mô phỏng. Vui lòng thử lại.' });
    const runId = randomUUID();
    const success = await baselineRequest(app).post(url).send({ ...body, runId }).expect(200);
    expect(success.body.runId).toBe(runId);
    expect(employeeRead).toHaveBeenCalledTimes(2);
    expectUnchanged(before);
    employeeSkills.delete(employeeSkillKey(fixture.employeeId, fixture.skillId));
    const invalid = await baselineRequest(app).post(url).send(body).expect(400);
    expect(invalid.body.code).toBe('INVALID_SCENARIO');
    projects.delete(fixture.projectId);
    const deleted = await baselineRequest(app).post(url).send(body).expect(404);
    expect(deleted.body.code).toBe('INVALID_SCENARIO');
  });

  it('creates Employee and Skill, assigns the relation, and lists it', async () => {
    const employeeResponse = await baselineRequest(app)
      .post('/employees')
      .send({ displayName: '  Nguyen Van An  ' })
      .expect(201);
    expect(employeeResponse.body).toMatchObject({
      displayName: 'Nguyen Van An',
    });

    const skillResponse = await baselineRequest(app)
      .post('/skills')
      .send({ name: '  TypeScript  ' })
      .expect(201);
    expect(skillResponse.body).toMatchObject({ name: 'TypeScript' });

    await baselineRequest(app)
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(201)
      .expect({
        employeeId: employeeResponse.body.id,
        skillId: skillResponse.body.id,
      });

    await baselineRequest(app)
      .get('/employees')
      .expect(200)
      .expect([
        {
          id: employeeResponse.body.id,
          displayName: 'Nguyen Van An',
        },
      ]);
    await baselineRequest(app)
      .get(`/employees/${employeeResponse.body.id}`)
      .expect(200)
      .expect({
        id: employeeResponse.body.id,
        displayName: 'Nguyen Van An',
      });
    await baselineRequest(app)
      .get('/skills')
      .expect(200)
      .expect([{ id: skillResponse.body.id, name: 'TypeScript' }]);
    await baselineRequest(app)
      .get(`/skills/${skillResponse.body.id}`)
      .expect(200)
      .expect({ id: skillResponse.body.id, name: 'TypeScript' });
    await baselineRequest(app)
      .get(`/employees/${employeeResponse.body.id}/skills`)
      .expect(200)
      .expect([{ id: skillResponse.body.id, name: 'TypeScript' }]);
  });

  it('rejects invalid or missing EmployeeSkill relations and duplicates', async () => {
    const employeeResponse = await baselineRequest(app)
      .post('/employees')
      .send({ displayName: 'Nguyen Van An' })
      .expect(201);
    const skillResponse = await baselineRequest(app)
      .post('/skills')
      .send({ name: 'TypeScript' })
      .expect(201);

    await baselineRequest(app)
      .post('/employees/not-a-uuid/skills')
      .send({ skillId: skillResponse.body.id })
      .expect(400);
    await baselineRequest(app)
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: 'not-a-uuid' })
      .expect(400);
    await baselineRequest(app)
      .post(`/employees/${randomUUID()}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(404);
    await baselineRequest(app)
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: randomUUID() })
      .expect(404);

    await baselineRequest(app)
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(201);
    await baselineRequest(app)
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(409);
    await baselineRequest(app)
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id, level: 'senior' })
      .expect(400);
  });

  afterEach(async () => {
    await app?.close();
    vi.unstubAllEnvs();
  });
});

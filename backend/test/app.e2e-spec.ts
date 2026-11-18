import { randomUUID } from 'node:crypto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
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

  beforeEach(async () => {
    process.env.DB_HOST = 'test-host';
    process.env.DB_PORT = '3306';
    process.env.DB_USERNAME = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_DATABASE = 'test-database';

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
      find: vi.fn(async () => [...projects.values()]),
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

    const employeeRepository = {
      create: vi.fn((input: Pick<Employee, 'displayName'>) => ({
        id: randomUUID(),
        ...input,
      })),
      save: vi.fn(async (employee: Employee) => {
        employees.set(employee.id, employee);
        return employee;
      }),
      find: vi.fn(async (options?: { relations?: unknown }) =>
        [...employees.values()].map((employee) =>
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
        ),
      ),
      findOneBy: vi.fn(
        async ({ id }: { id: string }) => employees.get(id) ?? null,
      ),
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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getDataSourceToken())
      .useValue({ manager: {}, isInitialized: false })
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
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('creates and lists the Project -> Sprint -> Task foundation', async () => {
    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .send({ name: '  Project Alpha  ' })
      .expect(201);
    expect(projectResponse.body).toMatchObject({ name: 'Project Alpha' });

    const sprintResponse = await request(app.getHttpServer())
      .post(`/projects/${projectResponse.body.id}/sprints`)
      .send({ name: '  Sprint 1  ' })
      .expect(201);
    expect(sprintResponse.body).toMatchObject({
      projectId: projectResponse.body.id,
      name: 'Sprint 1',
    });

    const taskResponse = await request(app.getHttpServer())
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

    const updatedTask = await request(app.getHttpServer())
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

    const clearedEstimate = await request(app.getHttpServer())
      .patch(`/sprints/${sprintResponse.body.id}/tasks/${taskResponse.body.id}`)
      .send({ estimatedHours: null })
      .expect(200);
    expect(clearedEstimate.body).toMatchObject({
      status: 'IN_PROGRESS',
      dueDate: '2026-12-01',
      estimatedHours: null,
    });

    const clearedDueDate = await request(app.getHttpServer())
      .patch(`/sprints/${sprintResponse.body.id}/tasks/${taskResponse.body.id}`)
      .send({ dueDate: null })
      .expect(200);
    expect(clearedDueDate.body).toMatchObject({
      status: 'IN_PROGRESS',
      dueDate: null,
      estimatedHours: null,
    });

    await request(app.getHttpServer())
      .get('/projects')
      .expect(200)
      .expect([{ id: projectResponse.body.id, name: 'Project Alpha' }]);
    await request(app.getHttpServer())
      .get(`/projects/${projectResponse.body.id}`)
      .expect(200)
      .expect({ id: projectResponse.body.id, name: 'Project Alpha' });
    await request(app.getHttpServer())
      .get(`/projects/${projectResponse.body.id}/sprints`)
      .expect(200)
      .expect([
        {
          id: sprintResponse.body.id,
          projectId: projectResponse.body.id,
          name: 'Sprint 1',
        },
      ]);
    await request(app.getHttpServer())
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
    await request(app.getHttpServer())
      .post('/projects')
      .send({ name: '   ' })
      .expect(400);
    await request(app.getHttpServer()).get('/projects/not-a-uuid').expect(400);
    await request(app.getHttpServer())
      .get(`/projects/${randomUUID()}`)
      .expect(404);
    await request(app.getHttpServer())
      .post(`/projects/${randomUUID()}/sprints`)
      .send({ name: 'Sprint 1' })
      .expect(404);
    await request(app.getHttpServer())
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1' })
      .expect(404);
    await request(app.getHttpServer())
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', dueDate: '2026-02-30' })
      .expect(400);
    await request(app.getHttpServer())
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', dueDate: '30-12-2026' })
      .expect(400);
    await request(app.getHttpServer())
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', estimatedHours: 0 })
      .expect(400);
    await request(app.getHttpServer())
      .post(`/sprints/${randomUUID()}/tasks`)
      .send({ title: 'Task 1', estimatedHours: '3.5' })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .send({ status: 'INVALID_STATUS' })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/sprints/${randomUUID()}/tasks/not-a-uuid`)
      .send({ status: 'DONE' })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .send({ status: 'DONE' })
      .expect(404);
    await request(app.getHttpServer())
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .send({ status: null })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/sprints/${randomUUID()}/tasks/${randomUUID()}`)
      .set('Content-Type', 'application/json')
      .send('{"estimatedHours":1e309}')
      .expect(400);
  });

  it('rejects updating task with a different sprint ID and preserves original task data', async () => {
    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .send({ name: 'Project Beta' })
      .expect(201);

    const sprint1 = await request(app.getHttpServer())
      .post(`/projects/${projectResponse.body.id}/sprints`)
      .send({ name: 'Sprint 1' })
      .expect(201);

    const sprint2 = await request(app.getHttpServer())
      .post(`/projects/${projectResponse.body.id}/sprints`)
      .send({ name: 'Sprint 2' })
      .expect(201);

    const task1 = await request(app.getHttpServer())
      .post(`/sprints/${sprint1.body.id}/tasks`)
      .send({ title: 'Task in Sprint 1' })
      .expect(201);
    expect(task1.body.status).toBe('TODO');
    expect(task1.body).toMatchObject({
      dueDate: null,
      estimatedHours: null,
    });

    // Attempt to update task1 using sprint2 ID
    await request(app.getHttpServer())
      .patch(`/sprints/${sprint2.body.id}/tasks/${task1.body.id}`)
      .send({ status: 'DONE' })
      .expect(404);
    await request(app.getHttpServer())
      .patch(`/sprints/${sprint2.body.id}/tasks/${task1.body.id}`)
      .send({ dueDate: '2026-12-20', estimatedHours: 8.25 })
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/sprints/${sprint1.body.id}/tasks/${task1.body.id}/status`)
      .send({ status: 'DONE' })
      .expect(404);
    await request(app.getHttpServer())
      .patch(`/tasks/${task1.body.id}`)
      .send({ status: 'DONE' })
      .expect(404);
    await request(app.getHttpServer())
      .patch(`/tasks/${task1.body.id}/status`)
      .send({ status: 'DONE' })
      .expect(404);

    // Verify task1 in sprint1 remains unchanged with status 'TODO'
    const sprint1Tasks = await request(app.getHttpServer())
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
    const sprint2Tasks = await request(app.getHttpServer())
      .get(`/sprints/${sprint2.body.id}/tasks`)
      .expect(200);
    expect(sprint2Tasks.body).toHaveLength(0);
  });

  it('assesses only tasks in the project and supplies the current Vietnam date', async () => {
    const projectA = randomUUID();
    const projectB = randomUUID();
    projects.set(projectA, { id: projectA, name: 'A' } as Project);
    projects.set(projectB, { id: projectB, name: 'B' } as Project);
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
      const result = await request(app.getHttpServer())
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
      await request(app.getHttpServer())
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

    const result = await request(app.getHttpServer())
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
    await request(app.getHttpServer())
      .get('/employees/availability')
      .expect(200)
      .expect({ ...getAvailabilityWeek(), employees: [] });
  });

  it('creates Employee and Skill, assigns the relation, and lists it', async () => {
    const employeeResponse = await request(app.getHttpServer())
      .post('/employees')
      .send({ displayName: '  Nguyen Van An  ' })
      .expect(201);
    expect(employeeResponse.body).toMatchObject({
      displayName: 'Nguyen Van An',
    });

    const skillResponse = await request(app.getHttpServer())
      .post('/skills')
      .send({ name: '  TypeScript  ' })
      .expect(201);
    expect(skillResponse.body).toMatchObject({ name: 'TypeScript' });

    await request(app.getHttpServer())
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(201)
      .expect({
        employeeId: employeeResponse.body.id,
        skillId: skillResponse.body.id,
      });

    await request(app.getHttpServer())
      .get('/employees')
      .expect(200)
      .expect([
        {
          id: employeeResponse.body.id,
          displayName: 'Nguyen Van An',
        },
      ]);
    await request(app.getHttpServer())
      .get(`/employees/${employeeResponse.body.id}`)
      .expect(200)
      .expect({
        id: employeeResponse.body.id,
        displayName: 'Nguyen Van An',
      });
    await request(app.getHttpServer())
      .get('/skills')
      .expect(200)
      .expect([{ id: skillResponse.body.id, name: 'TypeScript' }]);
    await request(app.getHttpServer())
      .get(`/skills/${skillResponse.body.id}`)
      .expect(200)
      .expect({ id: skillResponse.body.id, name: 'TypeScript' });
    await request(app.getHttpServer())
      .get(`/employees/${employeeResponse.body.id}/skills`)
      .expect(200)
      .expect([{ id: skillResponse.body.id, name: 'TypeScript' }]);
  });

  it('rejects invalid or missing EmployeeSkill relations and duplicates', async () => {
    const employeeResponse = await request(app.getHttpServer())
      .post('/employees')
      .send({ displayName: 'Nguyen Van An' })
      .expect(201);
    const skillResponse = await request(app.getHttpServer())
      .post('/skills')
      .send({ name: 'TypeScript' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/employees/not-a-uuid/skills')
      .send({ skillId: skillResponse.body.id })
      .expect(400);
    await request(app.getHttpServer())
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: 'not-a-uuid' })
      .expect(400);
    await request(app.getHttpServer())
      .post(`/employees/${randomUUID()}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(404);
    await request(app.getHttpServer())
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: randomUUID() })
      .expect(404);

    await request(app.getHttpServer())
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id })
      .expect(409);
    await request(app.getHttpServer())
      .post(`/employees/${employeeResponse.body.id}/skills`)
      .send({ skillId: skillResponse.body.id, level: 'senior' })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});

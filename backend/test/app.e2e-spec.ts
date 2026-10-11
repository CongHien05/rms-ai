import { randomUUID } from 'node:crypto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { EmployeeSkill } from './../src/employee-skills/employee-skill.entity.js';
import { Employee } from './../src/employees/employee.entity.js';
import { Project } from './../src/projects/project.entity.js';
import { Skill } from './../src/skills/skill.entity.js';
import { Sprint } from './../src/sprints/sprint.entity.js';
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
      create: vi.fn((input: Pick<Task, 'sprintId' | 'title'>) => ({
        id: randomUUID(),
        ...input,
      })),
      save: vi.fn(async (task: Task) => {
        tasks.set(task.id, task);
        return task;
      }),
      findBy: vi.fn(async ({ sprintId }: { sprintId: string }) =>
        [...tasks.values()].filter((task) => task.sprintId === sprintId),
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
      find: vi.fn(async () => [...employees.values()]),
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
      .send({ title: '  Task 1  ' })
      .expect(201);
    expect(taskResponse.body).toMatchObject({
      sprintId: sprintResponse.body.id,
      title: 'Task 1',
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

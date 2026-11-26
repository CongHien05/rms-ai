import { Controller, Get } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { configureApp } from '../src/app-config.js';
import { AppModule } from '../src/app.module.js';
import { Roles } from '../src/auth/auth-policy.js';
import { AuthSession } from '../src/auth/auth-session.entity.js';
import { UserAccount } from '../src/auth/user-account.entity.js';
import { EmployeeSkill } from '../src/employee-skills/employee-skill.entity.js';
import { Employee } from '../src/employees/employee.entity.js';
import { Project } from '../src/projects/project.entity.js';
import { Skill } from '../src/skills/skill.entity.js';
import { Sprint } from '../src/sprints/sprint.entity.js';
import { Task } from '../src/tasks/task.entity.js';
import { configureAuthTestEnv, createAuthFixture, firstEmployeeId, secondEmployeeId } from './auth-test-fixtures.js';

@Controller('test-policy')
@Roles('PM')
class UnclassifiedController {
  @Get()
  read() { return { denied: false }; }
}

export async function openAuthApp(https = false, decisionRepository?: (entity: unknown) => unknown) {
  configureAuthTestEnv();
  if (https) {
    vi.stubEnv('AUTH_MODE', 'https');
    vi.stubEnv('AUTH_FRONTEND_ORIGIN', 'https://rms.fixture.invalid');
  }
  const fixture = createAuthFixture();
  const projects = new Map<string, Project>();
  const sprints = new Map<string, Sprint>();
  const taskReads = vi.fn(async () => []);
  const taskWrites = vi.fn();
  const employeeA = { id: firstEmployeeId, displayName: 'Fixture A' };
  const employeeB = { id: secondEmployeeId, displayName: 'Fixture B' };
  const employees = new Map([[employeeA.id, employeeA], [employeeB.id, employeeB]]);
  const accountsRepository = {
    createQueryBuilder() {
      let filter: { email?: string; id?: string };
      return {
        addSelect() { return this; },
        where(_sql: string, parameters: typeof filter) { filter = parameters; return this; },
        setLock() { return this; },
        async getOne() {
          if (filter.id) return fixture.accounts.get(filter.id) ?? null;
          return [...fixture.accounts.values()].find(account => account.email === filter.email) ?? null;
        },
      };
    },
    findOne: async ({ where }: { where: { id: string } }) => fixture.accounts.get(where.id) ?? null,
  };
  const manager = {
    getRepository: (entity: unknown) => entity === UserAccount ? accountsRepository : fixture.sessionsRepository,
  };
  const decisionManager = {
    async query(sql: string, [id]: [string]) {
      if (sql.includes('FROM user_accounts')) return [fixture.accounts.get(id)].filter(Boolean);
      if (sql.includes('FROM projects')) return [projects.get(id)].filter(Boolean);
      throw new Error('Unexpected decision fixture query.');
    },
    getRepository: (entity: unknown) => {
      if (entity === UserAccount) return accountsRepository;
      if (entity === Project) return { findOne: async ({ where }: { where: { id: string } }) => projects.get(where.id) ?? null };
      return decisionRepository?.(entity);
    },
  };
  let transactionQueue = Promise.resolve();
  function transaction(
    isolationOrCallback: string | ((value: typeof manager) => unknown),
    work?: (value: typeof decisionManager) => unknown,
  ) {
    if (typeof isolationOrCallback === 'function') return isolationOrCallback(manager);
    const operation = transactionQueue.then(() => work!(decisionManager));
    transactionQueue = operation.then(() => undefined, () => undefined);
    return operation;
  }
  const dataSource = {
    manager, isInitialized: false, transaction,
    getRepository: manager.getRepository,
  };
  const testing = Test.createTestingModule({ imports: [AppModule], controllers: [UnclassifiedController] })
    .overrideProvider(getDataSourceToken()).useValue(dataSource)
    .overrideProvider(getRepositoryToken(AuthSession)).useValue(fixture.sessionsRepository)
    .overrideProvider(getRepositoryToken(Project)).useValue({
      findOneBy: async ({ id }: { id: string }) => projects.get(id) ?? null,
      findBy: async ({ pmAccountId }: { pmAccountId: string }) => [...projects.values()].filter(it => it.pmAccountId === pmAccountId),
    })
    .overrideProvider(getRepositoryToken(Sprint)).useValue({
      findOneBy: async ({ id }: { id: string }) => sprints.get(id) ?? null,
      findBy: async ({ projectId }: { projectId: string }) => [...sprints.values()].filter(it => it.projectId === projectId),
    })
    .overrideProvider(getRepositoryToken(Task)).useValue({
      findBy: taskReads, findOneBy: async () => null, save: taskWrites,
    })
    .overrideProvider(getRepositoryToken(Employee)).useValue({
      findOneBy: async ({ id }: { id: string }) => employees.get(id) ?? null,
      findOne: async () => null,
      findAll: async () => [...employees.values()],
      find: async () => [],
    })
    .overrideProvider(getRepositoryToken(EmployeeSkill)).useValue({ find: async () => [] })
    .overrideProvider(getRepositoryToken(Skill)).useValue({ find: async () => [] });
  const app = (await testing.compile()).createNestApplication();
  configureApp(app);
  await app.init();
  return { app, client: request(app.getHttpServer()), ...fixture, projects, sprints, taskReads, taskWrites };
}

import { UserAccount } from '../auth/user-account.entity.js';
import { AuthSession } from '../auth/auth-session.entity.js';
import { AddAuthAndProjectOwner1791240000000 } from './migrations/1791240000000-add-auth-and-project-owner.js';
import { AddPMDecisions1791250000000 } from './migrations/1791250000000-add-pm-decisions.js';
import { AddApplyAllocation1791260000000 } from './migrations/1791260000000-add-apply-allocation.js';
import { ApplicationResult } from '../projects/allocations/application-result.entity.js';
import { ProjectAllocation } from '../projects/allocations/project-allocation.entity.js';
import { DecisionAvailabilityEvidence } from '../projects/decisions/decision-availability-evidence.entity.js';
import { PMDecision } from '../projects/decisions/pm-decision.entity.js';
import { EmployeeSkill } from '../employee-skills/employee-skill.entity.js';
import { Employee } from '../employees/employee.entity.js';
import { Project } from '../projects/project.entity.js';
import { Skill } from '../skills/skill.entity.js';
import { Sprint } from '../sprints/sprint.entity.js';
import { Task } from '../tasks/task.entity.js';
import { AddTaskPlanningFields1791220000000 } from './migrations/1791220000000-add-task-planning-fields.js';
import { AddEmployeeAvailability1791230000000 } from './migrations/1791230000000-add-employee-availability.js';
import {
  createDataSourceOptions,
  createTypeOrmModuleOptions,
} from './database.config.js';
import { AddStatusToTasks1791130000000 } from './migrations/1791130000000-add-status-to-tasks.js';
import { CreateEmployeeSkillFoundation1791123398274 } from './migrations/1791123398274-create-employee-skill-foundation.js';
import { CreateProjectSprintTaskFoundation1791120736172 } from './migrations/1791120736172-create-project-sprint-task-foundation.js';

describe('database configuration', () => {
  const originalEnvironment = { ...process.env };

  function setValidEnvironment(): void {
    Object.assign(process.env, {
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USERNAME: 'test-user',
      DB_PASSWORD: 'test-password',
      DB_DATABASE: 'test-database',
    });
  }

  afterEach(() => {
    process.env = { ...originalEnvironment };
  });

  it('uses the explicit MySQL entities and migration with synchronization disabled', () => {
    setValidEnvironment();

    const moduleOptions = createTypeOrmModuleOptions();

    expect(moduleOptions).toMatchObject({
      type: 'mysql',
      synchronize: false,
      migrationsRun: false,
      entities: [Project, Sprint, Task, Employee, Skill, EmployeeSkill, UserAccount, AuthSession, PMDecision,
        DecisionAvailabilityEvidence, ProjectAllocation, ApplicationResult],
      migrations: [
        CreateProjectSprintTaskFoundation1791120736172,
        CreateEmployeeSkillFoundation1791123398274,
        AddStatusToTasks1791130000000,
        AddTaskPlanningFields1791220000000,
        AddEmployeeAvailability1791230000000,
        AddAuthAndProjectOwner1791240000000,
        AddPMDecisions1791250000000,
        AddApplyAllocation1791260000000,
      ],
    });
    expect(moduleOptions).not.toHaveProperty('autoLoadEntities');
    expect(createDataSourceOptions()).toEqual(moduleOptions);
  });

  it('rejects a missing required environment variable', () => {
    setValidEnvironment();
    delete process.env.DB_HOST;

    expect(() => createTypeOrmModuleOptions()).toThrow(
      'Missing required environment variable: DB_HOST',
    );
  });

  it('accepts an explicitly empty local password and rejects an absent password', () => {
    setValidEnvironment();
    process.env.DB_PASSWORD = '';
    expect(createDataSourceOptions()).toHaveProperty('password', '');
    delete process.env.DB_PASSWORD;
    expect(() => createDataSourceOptions()).toThrow(
      'Missing required environment variable: DB_PASSWORD',
    );
  });

  it.each(['not-a-number', '1.5', '0', '-1', '65536'])(
    'rejects invalid DB_PORT value %s',
    (port) => {
      setValidEnvironment();
      process.env.DB_PORT = port;

      expect(() => createTypeOrmModuleOptions()).toThrow(
        'DB_PORT must be an integer between 1 and 65535.',
      );
    },
  );
});

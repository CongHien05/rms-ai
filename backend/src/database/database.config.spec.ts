import { Project } from '../projects/project.entity.js';
import { Sprint } from '../sprints/sprint.entity.js';
import { Task } from '../tasks/task.entity.js';
import {
  createDataSourceOptions,
  createTypeOrmModuleOptions,
} from './database.config.js';
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
      entities: [Project, Sprint, Task],
      migrations: [CreateProjectSprintTaskFoundation1791120736172],
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

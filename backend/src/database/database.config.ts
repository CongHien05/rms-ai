import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';
import { Project } from '../projects/project.entity.js';
import { Sprint } from '../sprints/sprint.entity.js';
import { Task } from '../tasks/task.entity.js';
import { CreateProjectSprintTaskFoundation1791120736172 } from './migrations/1791120736172-create-project-sprint-task-foundation.js';

function readRequiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readDatabasePort(): number {
  const rawPort = readRequiredEnvironment('DB_PORT');
  const port = Number(rawPort);

  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error('DB_PORT must be an integer between 1 and 65535.');
  }

  return port;
}

function createBaseOptions() {
  return {
    type: 'mysql' as const,
    host: readRequiredEnvironment('DB_HOST'),
    port: readDatabasePort(),
    username: readRequiredEnvironment('DB_USERNAME'),
    password: readRequiredEnvironment('DB_PASSWORD'),
    database: readRequiredEnvironment('DB_DATABASE'),
    entities: [Project, Sprint, Task],
    migrations: [CreateProjectSprintTaskFoundation1791120736172],
    migrationsRun: false,
    synchronize: false,
  };
}

export function createTypeOrmModuleOptions(): TypeOrmModuleOptions {
  return createBaseOptions();
}

export function createDataSourceOptions(): DataSourceOptions {
  return createBaseOptions();
}

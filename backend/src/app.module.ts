import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { createTypeOrmModuleOptions } from './database/database.config.js';
import { ProjectsModule } from './projects/projects.module.js';
import { SprintsModule } from './sprints/sprints.module.js';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: createTypeOrmModuleOptions }),
    ProjectsModule,
    SprintsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

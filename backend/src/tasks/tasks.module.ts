import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintsModule } from '../sprints/sprints.module.js';
import { Task } from './task.entity.js';
import { TasksController, TasksDirectController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), SprintsModule],
  controllers: [TasksController, TasksDirectController],
  providers: [TasksService],
})
export class TasksModule {}

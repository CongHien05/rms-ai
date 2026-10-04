import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module.js';
import { Sprint } from './sprint.entity.js';
import { SprintsController } from './sprints.controller.js';
import { SprintsService } from './sprints.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint]), ProjectsModule],
  controllers: [SprintsController],
  providers: [SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}

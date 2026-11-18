import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Task } from '../tasks/task.entity.js';
import { ProjectsService } from './projects.service.js';
import { RiskClient, type RiskPrediction } from './risk-client.js';

const vietnamDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function assessmentDateInVietnam(now: Date): string {
  const parts = Object.fromEntries(
    vietnamDate.formatToParts(now).map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export type ProjectRiskAssessment = RiskPrediction & { assessmentDate: string };

@Injectable()
export class ProjectRiskService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
    private readonly riskClient: RiskClient,
  ) {}

  async assess(projectId: string): Promise<ProjectRiskAssessment> {
    const project = await this.projectsService.findOne(projectId);
    const tasks = await this.tasksRepository.find({
      select: { status: true, dueDate: true },
      where: { sprint: { projectId: project.id } },
    });
    const assessmentDate = assessmentDateInVietnam(new Date());
    const prediction = await this.riskClient.predict({
      projectId: project.id,
      assessmentDate,
      tasks: tasks.map(({ status, dueDate }) => ({ status, dueDate })),
    });
    return { ...prediction, assessmentDate };
  }
}

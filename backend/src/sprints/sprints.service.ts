import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service.js';
import { Sprint } from './sprint.entity.js';

export interface SprintResponse {
  id: string;
  projectId: string;
  name: string;
}

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintsRepository: Repository<Sprint>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(projectId: string, name: string): Promise<SprintResponse> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new BadRequestException('Tên Sprint không được để trống.');
    }

    await this.projectsService.findOne(projectId);

    const sprint = this.sprintsRepository.create({
      projectId,
      name: normalizedName,
    });
    return this.toResponse(await this.sprintsRepository.save(sprint));
  }

  async findAllByProject(projectId: string): Promise<SprintResponse[]> {
    await this.projectsService.findOne(projectId);
    const sprints = await this.sprintsRepository.findBy({ projectId });
    return sprints.map((sprint) => this.toResponse(sprint));
  }

  async findOne(sprintId: string): Promise<SprintResponse> {
    const sprint = await this.sprintsRepository.findOneBy({ id: sprintId });

    if (!sprint) {
      throw new NotFoundException('Không tìm thấy Sprint.');
    }

    return this.toResponse(sprint);
  }

  private toResponse(sprint: Sprint): SprintResponse {
    return {
      id: sprint.id,
      projectId: sprint.projectId,
      name: sprint.name,
    };
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { forbidden } from '../auth/auth-policy.js';
import { Project } from './project.entity.js';

export interface ProjectResponse {
  id: string;
  name: string;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(name: string, pmAccountId: string): Promise<ProjectResponse> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new BadRequestException('Tên Project không được để trống.');
    }

    const project = this.projectsRepository.create({ name: normalizedName, pmAccountId });
    return this.toResponse(await this.projectsRepository.save(project));
  }

  async findAll(pmAccountId: string): Promise<ProjectResponse[]> {
    const projects = await this.projectsRepository.findBy({ pmAccountId });
    return projects.map((project) => this.toResponse(project));
  }

  async findOne(projectId: string): Promise<ProjectResponse> {
    return this.toResponse(await this.readProject(projectId));
  }

  async requireOwned(projectId: string, pmAccountId: string): Promise<ProjectResponse> {
    const project = await this.readProject(projectId);
    if (project.pmAccountId !== pmAccountId) throw forbidden();
    return this.toResponse(project);
  }

  private async readProject(projectId: string): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException('Không tìm thấy Project.');
    }

    return project;
  }

  private toResponse(project: Project): ProjectResponse {
    return { id: project.id, name: project.name };
  }
}

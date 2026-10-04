import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
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

  async create(name: string): Promise<ProjectResponse> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new BadRequestException('Tên Project không được để trống.');
    }

    const project = this.projectsRepository.create({ name: normalizedName });
    return this.toResponse(await this.projectsRepository.save(project));
  }

  async findAll(): Promise<ProjectResponse[]> {
    const projects = await this.projectsRepository.find();
    return projects.map((project) => this.toResponse(project));
  }

  async findOne(projectId: string): Promise<ProjectResponse> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException('Không tìm thấy Project.');
    }

    return this.toResponse(project);
  }

  private toResponse(project: Project): ProjectResponse {
    return { id: project.id, name: project.name };
  }
}

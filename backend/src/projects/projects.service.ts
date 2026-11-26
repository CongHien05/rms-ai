import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';
import { forbidden } from '../auth/auth-policy.js';
import { Project } from './project.entity.js';

export interface ProjectResponse {
  id: string;
  name: string;
}

type ProjectOwnership = Pick<Project, 'id' | 'name' | 'pmAccountId'>;

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

  async requireOwned(
    projectId: string,
    pmAccountId: string,
    transaction?: { manager: EntityManager; lock: 'pessimistic_read' | 'pessimistic_write' },
  ): Promise<ProjectResponse> {
    const project = await this.readProject(projectId, transaction);
    if (project.pmAccountId !== pmAccountId) throw forbidden();
    return this.toResponse(project);
  }

  private async readProject(
    projectId: string,
    transaction?: { manager: EntityManager; lock: 'pessimistic_read' | 'pessimistic_write' },
  ): Promise<ProjectOwnership> {
    let project: ProjectOwnership | null | undefined;
    if (transaction?.lock === 'pessimistic_read') {
      // The existing MySQL driver can mistake MariaDB 10.x for MySQL 8 and emit FOR SHARE.
      [project] = await transaction.manager.query(
        'SELECT id, name, pmAccountId FROM projects WHERE id = ? LOCK IN SHARE MODE', [projectId],
      ) as ProjectOwnership[];
    } else if (transaction) {
      project = await transaction.manager.getRepository(Project).findOne({
        where: { id: projectId }, lock: { mode: transaction.lock },
      });
    } else {
      project = await this.projectsRepository.findOneBy({ id: projectId });
    }

    if (!project) {
      throw new NotFoundException('Không tìm thấy Project.');
    }

    return project;
  }

  private toResponse(project: ProjectResponse): ProjectResponse {
    return { id: project.id, name: project.name };
  }
}

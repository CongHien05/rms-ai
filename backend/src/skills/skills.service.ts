import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Skill } from './skill.entity.js';

export interface SkillResponse {
  id: string;
  name: string;
}

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  async create(name: string): Promise<SkillResponse> {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new BadRequestException('Tên Skill không được để trống.');
    }

    const skill = this.skillsRepository.create({ name: normalizedName });
    return this.toResponse(await this.skillsRepository.save(skill));
  }

  async findAll(): Promise<SkillResponse[]> {
    const skills = await this.skillsRepository.find();
    return skills.map((skill) => this.toResponse(skill));
  }

  async findOne(skillId: string): Promise<SkillResponse> {
    const skill = await this.skillsRepository.findOneBy({ id: skillId });

    if (!skill) {
      throw new NotFoundException('Không tìm thấy Skill.');
    }

    return this.toResponse(skill);
  }

  private toResponse(skill: Skill): SkillResponse {
    return { id: skill.id, name: skill.name };
  }
}

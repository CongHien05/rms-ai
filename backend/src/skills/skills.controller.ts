import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/auth-policy.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { SkillsService, type SkillResponse } from './skills.service.js';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Roles('HR')
  @Post()
  create(@Body() body: CreateSkillDto): Promise<SkillResponse> {
    return this.skillsService.create(body.name);
  }

  @Roles('HR', 'PM')
  @Get()
  findAll(): Promise<SkillResponse[]> {
    return this.skillsService.findAll();
  }

  @Roles('HR')
  @Get(':skillId')
  findOne(
    @Param('skillId', ParseUUIDPipe) skillId: string,
  ): Promise<SkillResponse> {
    return this.skillsService.findOne(skillId);
  }
}

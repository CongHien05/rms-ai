import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { SkillsService, type SkillResponse } from './skills.service.js';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() body: CreateSkillDto): Promise<SkillResponse> {
    return this.skillsService.create(body.name);
  }

  @Get()
  findAll(): Promise<SkillResponse[]> {
    return this.skillsService.findAll();
  }

  @Get(':skillId')
  findOne(
    @Param('skillId', ParseUUIDPipe) skillId: string,
  ): Promise<SkillResponse> {
    return this.skillsService.findOne(skillId);
  }
}

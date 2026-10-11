import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AssignEmployeeSkillDto } from './dto/assign-employee-skill.dto.js';
import {
  EmployeeSkillsService,
  type EmployeeSkillResponse,
} from './employee-skills.service.js';
import type { SkillResponse } from '../skills/skills.service.js';

@Controller('employees/:employeeId/skills')
export class EmployeeSkillsController {
  constructor(private readonly employeeSkillsService: EmployeeSkillsService) {}

  @Post()
  assign(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Body() body: AssignEmployeeSkillDto,
  ): Promise<EmployeeSkillResponse> {
    return this.employeeSkillsService.assign(employeeId, body.skillId);
  }

  @Get()
  findByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ): Promise<SkillResponse[]> {
    return this.employeeSkillsService.findByEmployee(employeeId);
  }
}

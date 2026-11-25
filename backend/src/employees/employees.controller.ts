import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/auth-policy.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import {
  type EmployeeAvailabilityResponse,
  EmployeesService,
  type EmployeeResponse,
} from './employees.service.js';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles('HR')
  @Post()
  create(@Body() body: CreateEmployeeDto): Promise<EmployeeResponse> {
    return this.employeesService.create(body.displayName);
  }

  @Roles('HR')
  @Get()
  findAll(): Promise<EmployeeResponse[]> {
    return this.employeesService.findAll();
  }

  @Roles('HR')
  @Get('availability')
  findAvailability(): Promise<EmployeeAvailabilityResponse> {
    return this.employeesService.findAvailability();
  }

  @Roles('HR')
  @Get(':employeeId')
  findOne(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ): Promise<EmployeeResponse> {
    return this.employeesService.findOne(employeeId);
  }
}

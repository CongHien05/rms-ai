import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import {
  EmployeesService,
  type EmployeeResponse,
} from './employees.service.js';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() body: CreateEmployeeDto): Promise<EmployeeResponse> {
    return this.employeesService.create(body.displayName);
  }

  @Get()
  findAll(): Promise<EmployeeResponse[]> {
    return this.employeesService.findAll();
  }

  @Get(':employeeId')
  findOne(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ): Promise<EmployeeResponse> {
    return this.employeesService.findOne(employeeId);
  }
}

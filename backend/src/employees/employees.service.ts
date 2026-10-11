import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Employee } from './employee.entity.js';

export interface EmployeeResponse {
  id: string;
  displayName: string;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async create(displayName: string): Promise<EmployeeResponse> {
    const normalizedDisplayName = displayName.trim();

    if (!normalizedDisplayName) {
      throw new BadRequestException(
        'Tên hiển thị của Employee không được để trống.',
      );
    }

    const employee = this.employeesRepository.create({
      displayName: normalizedDisplayName,
    });
    return this.toResponse(await this.employeesRepository.save(employee));
  }

  async findAll(): Promise<EmployeeResponse[]> {
    const employees = await this.employeesRepository.find();
    return employees.map((employee) => this.toResponse(employee));
  }

  async findOne(employeeId: string): Promise<EmployeeResponse> {
    const employee = await this.employeesRepository.findOneBy({
      id: employeeId,
    });

    if (!employee) {
      throw new NotFoundException('Không tìm thấy Employee.');
    }

    return this.toResponse(employee);
  }

  private toResponse(employee: Employee): EmployeeResponse {
    return { id: employee.id, displayName: employee.displayName };
  }
}

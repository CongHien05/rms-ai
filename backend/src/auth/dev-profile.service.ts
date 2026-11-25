import { Injectable } from '@nestjs/common';
import { EmployeeSkillsService } from '../employee-skills/employee-skills.service.js';
import { EmployeesService } from '../employees/employees.service.js';
import { forbidden, type Principal } from './auth-policy.js';

@Injectable()
export class DevProfileService {
  constructor(private readonly employees: EmployeesService, private readonly employeeSkills: EmployeeSkillsService) {}

  async read(principal: Principal) {
    if (principal.role !== 'DEV' || !principal.employeeId) throw forbidden();
    const [employee, skills] = await Promise.all([
      this.employees.findOne(principal.employeeId),
      this.employeeSkills.findByEmployee(principal.employeeId),
    ]);
    return { employee, skills, workContext: { status: 'unavailable' as const } };
  }
}

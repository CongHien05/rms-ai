import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity.js';
import { RemainingAvailabilityService } from './remaining-availability.service.js';
import { EmployeesController } from './employees.controller.js';
import { EmployeesService } from './employees.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeesController],
  providers: [EmployeesService, RemainingAvailabilityService],
  exports: [EmployeesService, RemainingAvailabilityService],
})
export class EmployeesModule {}

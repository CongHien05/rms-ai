import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from '../employees/employees.module.js';
import { EmployeeSkillsModule } from '../employee-skills/employee-skills.module.js';
import { DevProfileService } from './dev-profile.service.js';
import { AuthConfig } from './auth.config.js';
import { AuthOriginGuard } from './auth-origin.guard.js';
import { AuthSession } from './auth-session.entity.js';
import { AuthSessionRepository } from './auth-session.repository.js';
import { AuthSessionService } from './auth-session.service.js';
import { AuthController } from './auth.controller.js';
import { AuthenticationGuard } from './authentication.guard.js';
import { AuthorizationGuard } from './authorization.guard.js';
import { LoginRateLimiter } from './login-rate-limiter.js';
import { PasswordHasher } from './password.js';

@Module({
  imports: [TypeOrmModule.forFeature([AuthSession]), EmployeesModule, EmployeeSkillsModule],
  controllers: [AuthController],
  providers: [
    DevProfileService, AuthConfig, AuthSessionRepository, AuthSessionService, PasswordHasher, LoginRateLimiter,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    { provide: APP_GUARD, useClass: AuthOriginGuard },
  ],
  exports: [AuthConfig],
})
export class AuthModule {}

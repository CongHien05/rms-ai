import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { forbidden, policyKey, type AuthRequest, type RoutePolicy } from './auth-policy.js';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const policy = this.reflector.get<RoutePolicy>(policyKey, context.getHandler());
    if (policy === 'public') return true;
    const principal = context.switchToHttp().getRequest<AuthRequest>().principal;
    if (principal && (policy === 'authenticated' || (policy && policy.includes(principal.role)))) return true;
    throw forbidden();
  }
}

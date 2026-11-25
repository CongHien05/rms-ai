import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { AuthConfig } from './auth.config.js';
import { AuthSessionRepository, cookieDigest } from './auth-session.repository.js';
import { policyKey, unauthenticated, type AuthRequest, type RoutePolicy } from './auth-policy.js';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: AuthConfig,
    private readonly sessions: AuthSessionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<AuthRequest>();
    const policy = this.reflector.get<RoutePolicy>(policyKey, context.getHandler());
    if (policy === 'public' && request.path === '/health') return true;
    http.getResponse<Response>().setHeader('Cache-Control', 'no-store');
    if (policy === 'public') return true;
    const digest = cookieDigest(request.headers.cookie, this.config.cookieName);
    const principal = digest && await this.sessions.findPrincipal(digest);
    if (!principal) throw unauthenticated();
    request.principal = principal;
    return true;
  }
}

import { ForbiddenException, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthConfig } from './auth.config.js';

@Injectable()
export class AuthOriginGuard implements CanActivate {
  constructor(private readonly config: AuthConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true;
    let origins = 0;
    for (let index = 0; index < request.rawHeaders.length; index += 2) {
      if (request.rawHeaders[index].toLowerCase() === 'origin') origins += 1;
    }
    if (origins === 1 && request.headers.origin === this.config.origin) return true;
    throw new ForbiddenException({
      statusCode: 403, code: 'ORIGIN_FORBIDDEN', message: 'Nguồn gửi yêu cầu không hợp lệ.',
    });
  }
}

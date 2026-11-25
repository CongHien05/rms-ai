import {
  createParamDecorator, ForbiddenException, ServiceUnavailableException, SetMetadata,
  UnauthorizedException, type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AccountRole } from './user-account.entity.js';

export type Principal = {
  accountId: string;
  role: AccountRole;
  employeeId: string | null;
  tokenDigest: string;
};

export type AuthRequest = Request & { principal?: Principal };
export type RoutePolicy = 'public' | 'authenticated' | readonly AccountRole[];
export const policyKey = Symbol('route-policy');
export const Public = () => SetMetadata(policyKey, 'public' satisfies RoutePolicy);
export const Authenticated = () => SetMetadata(policyKey, 'authenticated' satisfies RoutePolicy);
export const Roles = (...roles: AccountRole[]) => SetMetadata(policyKey, roles);
export const CurrentAccount = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const principal = context.switchToHttp().getRequest<AuthRequest>().principal;
    if (!principal) throw unauthenticated();
    return principal;
  },
);

export function unauthenticated() {
  return new UnauthorizedException({
    statusCode: 401, code: 'UNAUTHENTICATED', message: 'Phiên đăng nhập không hợp lệ.',
  });
}

export function forbidden() {
  return new ForbiddenException({
    statusCode: 403, code: 'FORBIDDEN', message: 'Bạn không có quyền thực hiện thao tác này.',
  });
}

export function authUnavailable() {
  return new ServiceUnavailableException({
    statusCode: 503, code: 'AUTH_UNAVAILABLE', message: 'Dịch vụ xác thực chưa khả dụng.',
  });
}

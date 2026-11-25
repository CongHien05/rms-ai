import {
  BadRequestException, Body, Controller, Get, HttpCode, HttpException, Post, Req, Res,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthConfig } from './auth.config.js';
import { Authenticated, CurrentAccount, Public, Roles, type Principal } from './auth-policy.js';
import { cookieDigest } from './auth-session.repository.js';
import { AuthSessionService, sessionLifetimeMs } from './auth-session.service.js';
import { LoginRateLimitError } from './login-rate-limiter.js';
import { DevProfileService } from './dev-profile.service.js';
import { loginValidation } from '../app-config.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sessions: AuthSessionService,
    private readonly config: AuthConfig,
    private readonly profiles: DevProfileService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Req() request: Request, @Res({ passthrough: true }) response: Response, @Body() input: unknown) {
    if (!request.is('application/json')) {
      if (request.headers['content-length'] && request.headers['content-length'] !== '0' ||
          request.headers['transfer-encoding']) throw new UnsupportedMediaTypeException();
      throw new BadRequestException('Yêu cầu thiếu thông tin đăng nhập.');
    }
    const body = await loginValidation.transform(input, { type: 'body', metatype: LoginDto }) as LoginDto;
    try {
      const result = await this.sessions.login(
        body.email, body.password, request.ip ?? request.socket.remoteAddress ?? 'unknown',
        cookieDigest(request.headers.cookie, this.config.cookieName),
      );
      response.cookie(this.config.cookieName, result.token, { ...this.config.cookieOptions, maxAge: sessionLifetimeMs });
      return result.user;
    } catch (error) {
      if (!(error instanceof LoginRateLimitError)) throw error;
      response.setHeader('Retry-After', error.retryAfter);
      throw new HttpException({
        statusCode: 429, code: 'LOGIN_RATE_LIMITED', message: 'Bạn đã thử đăng nhập nhiều lần. Hãy đợi rồi thử lại.',
      }, 429);
    }
  }

  @Authenticated()
  @Get('me')
  me(@CurrentAccount() principal: Principal) {
    return { accountId: principal.accountId, role: principal.role };
  }

  @Roles('DEV')
  @Get('me/employee')
  myEmployee(@CurrentAccount() principal: Principal, @Req() request: Request) {
    if (Object.keys(request.query).length) throw new BadRequestException('Không nhận tham số nhận dạng Employee.');
    return this.profiles.read(principal);
  }

  @Authenticated()
  @Post('logout')
  @HttpCode(204)
  async logout(
    @CurrentAccount() principal: Principal, @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (request.headers['content-length'] && request.headers['content-length'] !== '0' ||
        request.headers['transfer-encoding']) throw new BadRequestException('Đăng xuất không nhận dữ liệu.');
    await this.sessions.logout(principal.tokenDigest);
    response.cookie(this.config.cookieName, '', { ...this.config.cookieOptions, maxAge: 0 });
  }
}

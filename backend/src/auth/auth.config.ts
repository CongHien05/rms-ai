import { Injectable } from '@nestjs/common';
import { isIP } from 'node:net';

@Injectable()
export class AuthConfig {
  readonly local: boolean;
  readonly origin: string;
  readonly trustedProxies: string[];

  constructor() {
    const mode = process.env.AUTH_MODE;
    if (mode !== 'local' && mode !== 'https') {
      throw new Error('AUTH_MODE must be local or https.');
    }
    this.local = mode === 'local';
    const configuredOrigin = process.env.AUTH_FRONTEND_ORIGIN;
    let origin: URL | null = null;
    try {
      if (configuredOrigin) origin = new URL(configuredOrigin);
    } catch {
      throw new Error('AUTH_FRONTEND_ORIGIN must be a matching canonical origin.');
    }
    if (!origin || origin.origin !== configuredOrigin ||
        (this.local
          ? origin.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname)
          : origin.protocol !== 'https:')) {
      throw new Error('AUTH_FRONTEND_ORIGIN must be a matching canonical origin.');
    }
    this.origin = origin.origin;
    this.trustedProxies = (process.env.AUTH_TRUSTED_PROXY_IPS ?? '')
      .split(',').map((ip) => ip.trim()).filter(Boolean);
    if (this.trustedProxies.some((ip) => !isIP(ip))) {
      throw new Error('AUTH_TRUSTED_PROXY_IPS must contain only exact IP addresses.');
    }
  }

  get cookieName(): string {
    return this.local ? 'rms_session_dev' : '__Host-rms_session';
  }

  get cookieOptions() {
    return { httpOnly: true, secure: !this.local, sameSite: 'lax' as const, path: '/' };
  }
}

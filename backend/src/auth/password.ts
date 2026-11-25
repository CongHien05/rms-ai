import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const options = { N: 2 ** 17, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
const format = /^scrypt-v1\$([a-f0-9]{32})\$([a-f0-9]{128})$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function passwordLengthAllowed(password: string, minimum = 1): boolean {
  const characters = Array.from(password).length;
  return characters >= minimum && characters <= 128 && Buffer.byteLength(password, 'utf8') <= 512;
}

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, options, (error, key) => error ? reject(error) : resolve(key));
  });
}

@Injectable()
export class PasswordHasher {
  private readonly dummyHash = this.encode(randomBytes(16), randomBytes(64));

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16);
    return this.encode(salt, await derive(password, salt));
  }

  async verify(password: string, stored: string | undefined): Promise<boolean> {
    const actual = stored && format.exec(stored);
    const [, salt, expected] = actual || format.exec(this.dummyHash)!;
    const candidate = await derive(password, Buffer.from(salt, 'hex'));
    const matches = timingSafeEqual(candidate, Buffer.from(expected, 'hex'));
    return Boolean(actual && matches);
  }

  private encode(salt: Buffer, key: Buffer): string {
    return ['scrypt-v1', salt.toString('hex'), key.toString('hex')].join('$');
  }
}

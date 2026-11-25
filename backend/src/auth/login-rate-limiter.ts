import { Injectable } from '@nestjs/common';

type Counter = { count: number; until: number };
const windowMs = 15 * 60 * 1000;
const keyLimit = 10_000;
const maxConcurrent = 2;

export class LoginRateLimitError extends Error {
  constructor(readonly retryAfter: number) {
    super('Login rate limit reached.');
  }
}

@Injectable()
export class LoginRateLimiter {
  private readonly counters = new Map<string, Counter>();
  private active = 0;

  async run<T>(email: string, source: string, verify: () => Promise<T>, now = Date.now()): Promise<T> {
    this.prune(now);
    const keys = [`email:${email}`, `source:${source}`];
    const counters = keys.map((key) => this.counters.get(key));
    const blockedUntil = Math.max(
      ...counters.map((counter, index) => counter && counter.count >= (index === 0 ? 5 : 30) ? counter.until : now),
    );
    if (blockedUntil > now) throw new LoginRateLimitError(Math.ceil((blockedUntil - now) / 1000));
    if (this.active >= maxConcurrent) throw new LoginRateLimitError(1);

    const newKeys = counters.filter((counter) => !counter).length;
    if (this.counters.size + newKeys > keyLimit) {
      const oldest = this.counters.values().next().value as Counter;
      throw new LoginRateLimitError(Math.max(1, Math.ceil((oldest.until - now) / 1000)));
    }

    keys.forEach((key, index) => {
      const counter = counters[index];
      if (counter) counter.count += 1;
      else this.counters.set(key, { count: 1, until: now + windowMs });
    });
    this.active += 1;
    try {
      return await verify();
    } finally {
      this.active -= 1;
    }
  }

  private prune(now: number) {
    for (const [key, counter] of this.counters) {
      if (counter.until > now) break;
      this.counters.delete(key);
    }
  }
}

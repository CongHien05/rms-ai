import { LoginRateLimitError, LoginRateLimiter } from './login-rate-limiter.js';

it('limits normalized identity across sources and resumes after the window', async () => {
  const limiter = new LoginRateLimiter();
  const verify = vi.fn(async () => true);
  for (let n = 0; n < 5; n++) await limiter.run('fixture@invalid.test', String(n), verify, 1);
  await expect(limiter.run('fixture@invalid.test', 'another', verify, 2))
    .rejects.toMatchObject({ retryAfter: 900 });
  expect(verify).toHaveBeenCalledTimes(5);
  await expect(limiter.run('fixture@invalid.test', 'another', verify, 900_001)).resolves.toBe(true);
});

it('limits one source even when each login uses a different identity', async () => {
  const limiter = new LoginRateLimiter();
  const verify = vi.fn(async () => true);
  for (let n = 0; n < 30; n++) await limiter.run(String(n), 'source', verify, 10);
  await expect(limiter.run('new', 'source', verify, 10)).rejects.toBeInstanceOf(LoginRateLimitError);
  expect(verify).toHaveBeenCalledTimes(30);
});

it('rejects excess concurrent KDF work and releases the slot on errors', async () => {
  const limiter = new LoginRateLimiter();
  let end!: () => void;
  const stalled = new Promise<void>(resolve => { end = resolve; });
  const a = limiter.run('a', 'source', () => stalled);
  const b = limiter.run('b', 'source', () => stalled);
  await expect(limiter.run('c', 'source', () => stalled)).rejects.toMatchObject({ retryAfter: 1 });
  end();
  await Promise.all([a, b]);
  await expect(limiter.run('c', 'source', () => Promise.reject(new Error('failure')))).rejects.toThrow('failure');
  await expect(limiter.run('c', 'source', async () => true)).resolves.toBe(true);
});

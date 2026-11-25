import { PasswordHasher, passwordLengthAllowed } from './password.js';

it('hashes with the versioned scrypt format and an independent salt', async () => {
  const passwords = new PasswordHasher();
  const sample = ' fixture sample only ';
  const first = await passwords.hash(sample);
  const second = await passwords.hash(sample);
  expect(first).toMatch(/^scrypt-v1\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
  expect(second).not.toBe(first);
  await expect(passwords.verify(sample, first)).resolves.toBe(true);
  await expect(passwords.verify(sample.trim(), first)).resolves.toBe(false);
  await expect(passwords.verify(sample, undefined)).resolves.toBe(false);
}, 20_000);

it('enforces credential length in characters and UTF-8 bytes', () => {
  expect(passwordLengthAllowed('a'.repeat(14), 15)).toBe(false);
  expect(passwordLengthAllowed('🦊'.repeat(128), 15)).toBe(true);
  expect(passwordLengthAllowed('a'.repeat(129), 15)).toBe(false);
});

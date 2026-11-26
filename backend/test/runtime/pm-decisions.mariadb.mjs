import 'reflect-metadata';
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer, request } from 'node:http';
import { resolve, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from '../../dist/database/database.config.js';
import { AddPMDecisions1791250000000 } from '../../dist/database/migrations/1791250000000-add-pm-decisions.js';
import { PasswordHasher } from '../../dist/auth/password.js';
import { chromeWorkflow } from './pm-decisions.chrome.mjs';

const baseline = ['projects', 'sprints', 'tasks', 'employees', 'skills',
  'employee_skills', 'user_accounts', 'auth_sessions'];
const cloneName = /^rms_ai_pm003_(?:[a-z0-9]+_)?(?:clone|recovery)$/;
const options = createDataSourceOptions();
const localDir = resolve('../.local') + sep;
const expectedDir = resolve(process.env.PM003_CLONE_DATA_DIRECTORY ?? '');
assert.equal(options.host, '127.0.0.1');
assert.notEqual(options.port, 3306);
assert.match(options.database, cloneName, 'Chỉ dùng schema clone PM003.');
assert.ok(expectedDir.toLowerCase().startsWith(localDir.toLowerCase()), 'Đặt datadir clone dưới .local/.');
const [action = 'runtime'] = process.argv.slice(2);
const db = await new DataSource(action === 'baseline'
  ? { ...options, migrations: options.migrations.filter(item => item !== AddPMDecisions1791250000000) }
  : options).initialize();

async function validateTarget() {
  const [target] = await db.query('SELECT DATABASE() AS db, @@port AS port, @@datadir AS dir, VERSION() AS version');
  assert.equal(target.db, options.database);
  assert.equal(Number(target.port), options.port);
  assert.equal(resolve(target.dir).toLowerCase(), expectedDir.toLowerCase());
  assert.match(target.version, /MariaDB/);
  return target.version;
}

async function fingerprint(tables) {
  const hashes = {};
  for (const name of tables) {
    const columns = await db.query(`SHOW COLUMNS FROM ${name}`);
    const key = columns.filter(column => column.Key === 'PRI').map(column => `\`${column.Field}\``).join(', ');
    const rows = await db.query(`SELECT * FROM ${name} ORDER BY ${key}`);
    hashes[name] = { count: rows.length, hash: createHash('sha256').update(JSON.stringify(rows)).digest('hex') };
  }
  return hashes;
}

async function migrate(recovery) {
  const before = await fingerprint(baseline);
  if (recovery) {
    assert.ok(options.database.endsWith('_recovery'));
    const runner = db.createQueryRunner();
    try {
      await new AddPMDecisions1791250000000().up(runner);
    } finally {
      await runner.release();
    }
    const [pending] = await db.query('SELECT COUNT(*) AS total FROM migrations WHERE timestamp = 1791250000000');
    assert.equal(Number(pending.total), 0);
  }
  const applied = await db.runMigrations({ transaction: 'each' });
  assert.deepEqual(applied.map(({ name }) => name), ['AddPMDecisions1791250000000']);
  assert.deepEqual(await db.runMigrations({ transaction: 'each' }), []);
  assert.deepEqual(await fingerprint(baseline), before);
  const [table] = await db.query("SELECT ENGINE AS engine FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pm_decisions'");
  assert.equal(table.engine, 'InnoDB');
  console.log(JSON.stringify({ migration: recovery ? 'recovery' : 'additive', unchanged: baseline.length,
    counts: Object.fromEntries(Object.entries(before).map(([name, value]) => [name, value.count])) }));
}

const backend = 'http://127.0.0.1:3193';
const origin = 'http://127.0.0.1:5193';
let server;
let httpCount = 0;
async function startBackend(key = process.env.WHAT_IF_DECISION_SIGNING_KEY) {
  const existing = await fetch(backend + '/health', { signal: AbortSignal.timeout(1000) }).catch(() => null);
  assert.equal(existing, null, 'Cổng Backend runtime phải trống.');
  server = spawn(process.execPath, ['dist/main.js'], {
    env: { ...process.env, PORT: '3193', WHAT_IF_DECISION_SIGNING_KEY: key ?? '',
      AUTH_MODE: 'local', AUTH_FRONTEND_ORIGIN: origin, AUTH_TRUSTED_PROXY_IPS: '' },
    stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  });
  server.stdout.resume();
  server.stderr.resume();
  for (let i = 0; i < 250; i++) {
    assert.equal(server.exitCode, null, 'Không khởi động được Backend clone.');
    const health = await fetch(backend + '/health', { signal: AbortSignal.timeout(1000) }).catch(() => null);
    if (health?.ok) return;
    await delay(100);
  }
  throw new Error('Backend clone chưa sẵn sàng.');
}

async function stopBackend() {
  if (!server || server.exitCode !== null || !server.pid) return;
  const exited = once(server, 'exit');
  server.kill();
  await exited;
}

async function api(method, path, status, { cookie = '', input, from = origin } = {}) {
  httpCount += 1;
  const init = { method, headers: { Cookie: cookie, Origin: from, 'Content-Type': 'application/json' } };
  if (input !== undefined) init.body = JSON.stringify(input);
  const reply = await fetch(backend + path, init);
  assert.equal(reply.status, status, `${method} ${path}`);
  return { body: await reply.json(), cookie: reply.headers.get('set-cookie')?.split(';')[0] };
}

async function fixtures() {
  const password = randomBytes(24).toString('base64url');
  const hash = await new PasswordHasher().hash(password);
  const employee = randomUUID();
  const skill = randomUUID();
  const weekStart = '2026-11-16';
  const project = randomUUID();
  const otherProject = randomUUID();
  await db.query('INSERT INTO employees(id, displayName, availabilityWeekStart, availableHours) VALUES (?, ?, ?, ?)',
    [employee, 'Fixture PM003', weekStart, 0.3]);
  await db.query('INSERT INTO skills(id, name) VALUES (?, ?)', [skill, `Fixture PM003 ${skill.slice(0, 8)}`]);
  await db.query('INSERT INTO employee_skills(employeeId, skillId) VALUES (?, ?)', [employee, skill]);
  const accounts = [];
  for (const role of ['PM', 'PM', 'HR', 'DEV']) {
    const id = randomUUID();
    const email = `${id}@fixture.invalid`;
    await db.query('INSERT INTO user_accounts(id, email, passwordHash, role, employeeId) VALUES (?, ?, ?, ?, ?)',
      [id, email, hash, role, role === 'DEV' ? employee : null]);
    accounts.push({ id, email, password });
  }
  await db.query('INSERT INTO projects(id, name, pmAccountId) VALUES (?, ?, ?), (?, ?, ?)',
    [project, 'PM003 workflow', accounts[0].id, otherProject, 'PM003 khác', accounts[1].id]);
  return { project, otherProject, employee, skill, weekStart, accounts };
}

async function discardResponse(path, cookie, input) {
  const proxy = createServer((req, res) => {
    const upstream = request(backend + path, { method: 'POST', headers: req.headers }, (reply) => {
      reply.resume();
      reply.on('end', () => res.destroy());
    });
    upstream.on('error', () => res.destroy());
    req.pipe(upstream);
  });
  proxy.listen(0, '127.0.0.1');
  await once(proxy, 'listening');
  try {
    await assert.rejects(fetch(`http://127.0.0.1:${proxy.address().port}${path}`, {
      method: 'POST', headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify(input), signal: AbortSignal.timeout(5000),
    }));
  } finally {
    await new Promise(done => proxy.close(done));
  }
}

async function runtime() {
  assert.ok(options.database.endsWith('_clone'));
  assert.match(process.env.WHAT_IF_DECISION_SIGNING_KEY ?? '', /^[\w-]{43}$/);
  await startBackend();
  const { project, otherProject, employee, skill, weekStart, accounts } = await fixtures();
  const cookies = [];
  for (const { email, password } of accounts) {
    cookies.push((await api('POST', '/auth/login', 200, { input: { email, password } })).cookie);
  }
  const [pm, secondPm, hr, dev] = cookies;
  const route = `/projects/${project}`;
  const decisions = route + '/decisions';
  const unmapped = randomUUID();
  await db.query('INSERT INTO projects(id, name) VALUES (?, ?)', [unmapped, 'Fixture PM003 chưa gán']);
  const requirements = { skillId: skill, weekStart, requiredHours: 0.3 };
  const before = await fingerprint(baseline.slice(0, 6));
  const query = { cookie: pm };
  const recommend = await api('POST', route + '/resource-recommendations', 200, { ...query, input: requirements });
  const candidate = recommend.body.candidates.find(item => item.employeeId === employee);
  assert.ok(candidate);
  const scenario = { ...requirements, employeeId: employee, supportHours: 0.1,
    recommendationContext: candidate.recommendationContext };
  const simulate = async (choice = 'ACCEPT') => {
    const { body } = await api('POST', route + '/simulations', 200, { ...query, input: { runId: randomUUID(), scenario } });
    assert.deepEqual(body.expectedImpact, {
      hypotheticalSupportHours: 0.1, remainingRequiredHours: 0.2, remainingAvailableHours: 0.2,
    });
    return { ...body.decisionEvidence, decision: choice };
  };
  const submit = (input, status, cookie = pm) => api('POST', decisions, status, { cookie, input });
  assert.deepEqual((await api('GET', decisions, 200, query)).body, { items: [], hasMore: false });
  const accepted = await simulate();
  const rejected = await simulate('REJECT');
  const first = (await submit(accepted, 201)).body;
  await submit(rejected, 201);
  assert.deepEqual(first.expectedImpact, {
    hypotheticalSupportHours: 0.1, remainingRequiredHours: 0.2, remainingAvailableHours: 0.2,
  });
  assert.equal(first.snapshot.availableHours, 0.3);
  await assert.rejects(db.query(
    `INSERT INTO pm_decisions(id, simulationId, projectId, pmAccountId, decision, decidedAt, snapshot, expectedImpact, referenceDigest)
     SELECT ?, simulationId, projectId, pmAccountId, decision, decidedAt, snapshot, expectedImpact, referenceDigest
     FROM pm_decisions WHERE id = ?`, [randomUUID(), first.id]),
  error => error.errno === 1062);
  assert.deepEqual(await fingerprint(baseline.slice(0, 6)), before);
  await submit(accepted, 401, '');
  for (const cookie of [secondPm, hr, dev]) {
    await submit(accepted, 403, cookie);
    await api('GET', decisions, 403, { cookie });
  }
  await api('POST', decisions, 403, { ...query, input: accepted, from: 'http://localhost:5193' });
  await api('POST', `/projects/${otherProject}/decisions`, 403, { ...query, input: accepted });
  await api('POST', `/projects/${otherProject}/decisions`, 403, { cookie: secondPm, input: accepted });
  await api('GET', `/projects/${unmapped}/decisions`, 403, query);
  await api('POST', `/projects/${unmapped}/decisions`, 403, { ...query, input: accepted });
  await submit({ ...accepted, simulationToken: scenario.recommendationContext }, 400);
  await submit({ ...accepted, simulationToken: accepted.simulationToken + 'X' }, 400);
  await submit({ ...accepted, expectedImpact: {} }, 400);
  for (const competing of ['ACCEPT', 'REJECT']) {
    const input = await simulate();
    const calls = [input, { ...input, decision: competing }];
    const results = await Promise.all(calls.map(async value => {
      httpCount += 1;
      const response = await fetch(backend + decisions, {
        method: 'POST', headers: { Origin: origin, Cookie: pm, 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
      await response.arrayBuffer();
      return response.status;
    }));
    assert.deepEqual(results.sort(), competing === 'ACCEPT' ? [200, 201] : [201, 409]);
    const [row] = await db.query('SELECT COUNT(*) AS count FROM pm_decisions WHERE simulationId = ?', [input.simulationId]);
    assert.equal(Number(row.count), 1);
  }
  const failed = await simulate();
  await db.query("CREATE TRIGGER pm003_clone_rollback AFTER INSERT ON pm_decisions FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'clone runtime rollback'");
  try {
    await submit(failed, 503);
    const [row] = await db.query('SELECT COUNT(*) AS count FROM pm_decisions WHERE simulationId = ?', [failed.simulationId]);
    assert.equal(Number(row.count), 0);
  } finally {
    await db.query('DROP TRIGGER pm003_clone_rollback');
  }
  await submit(failed, 201);
  const lost = await simulate();
  const stale = await simulate();
  const skillStale = await simulate();
  await discardResponse(decisions, pm, lost);
  httpCount += 1;
  const [stored] = await db.query('SELECT id FROM pm_decisions WHERE simulationId = ?', [lost.simulationId]);
  assert.ok(stored);
  await db.query('UPDATE employees SET availableHours = ? WHERE id = ?', [0.2, employee]);
  await stopBackend();
  await startBackend();
  assert.equal((await submit(lost, 200)).body.id, stored.id);
  assert.equal((await submit({ ...lost, decision: 'REJECT' }, 409)).body.code, 'DECISION_CONFLICT');
  assert.equal((await submit(stale, 409)).body.code, 'STALE_SIMULATION');
  await db.query('UPDATE employees SET availableHours = ? WHERE id = ?', [0.3, employee]);
  await db.query('UPDATE employees SET availabilityWeekStart = ? WHERE id = ?', ['2026-11-23', employee]);
  assert.equal((await submit(stale, 409)).body.code, 'STALE_SIMULATION');
  await db.query('UPDATE employees SET availabilityWeekStart = ? WHERE id = ?', [weekStart, employee]);
  await db.query('DELETE FROM employee_skills WHERE employeeId = ? AND skillId = ?', [employee, skill]);
  assert.equal((await submit(skillStale, 409)).body.code, 'STALE_SIMULATION');
  await db.query('INSERT INTO employee_skills(employeeId, skillId) VALUES (?, ?)', [employee, skill]);
  await submit(stale, 201);
  await stopBackend();
  await startBackend(randomBytes(32).toString('base64url'));
  await submit(skillStale, 400);
  assert.equal((await submit(lost, 200)).body.id, stored.id);
  await stopBackend();
  await startBackend('');
  const missingKey = await api('POST', route + '/simulations', 200, { ...query, input: { runId: randomUUID(), scenario } });
  assert.equal(missingKey.body.decisionEvidence, undefined);
  await submit(skillStale, 503);
  await submit(lost, 200);
  assert.deepEqual(await fingerprint(baseline.slice(0, 6)), before);
  await db.query('UPDATE projects SET pmAccountId = ? WHERE id = ?', [accounts[1].id, project]);
  await api('GET', decisions, 403, query);
  const history = await api('GET', decisions, 200, { cookie: secondPm });
  assert.equal(history.body.items.find(row => row.id === stored.id).pmAccountId, accounts[0].id);
  assert.ok(history.body.items.every(row => !row.referenceDigest && !row.simulationToken));
  await submit(lost, 403, secondPm);
  const digest = createHash('sha256').update(secondPm.split('=')[1]).digest('hex');
  await db.query('UPDATE auth_sessions SET expiresAt = ? WHERE tokenDigest = ?', [new Date(0), digest]);
  await submit(lost, 401, secondPm);
  console.log(JSON.stringify({ runtime: 'MariaDB/NestJS', httpCount, evidence: 'concurrency, rollback, retry, scope, key, source' }));
}

try {
  const version = await validateTarget();
  if (action === 'baseline') {
    await db.runMigrations({ transaction: 'each' });
    const fixture = await fixtures();
    await db.query('INSERT INTO auth_sessions(tokenDigest, accountId, expiresAt) VALUES (?, ?, ?)',
      [randomBytes(32).toString('hex'), fixture.accounts[0].id, new Date(Date.now() + 60_000)]);
    console.log(JSON.stringify({ baseline: '002', version, target: options.database }));
  } else if (action === 'migrate' || action === 'recovery') {
    await migrate(action === 'recovery');
  } else if (action === 'runtime') {
    await runtime();
  } else if (action === 'browser') {
    assert.ok(options.database.endsWith('_clone'));
    await startBackend();
    const fixture = await fixtures();
    await db.query('UPDATE projects SET pmAccountId = ? WHERE id = ?', [fixture.accounts[0].id, fixture.otherProject]);
    await chromeWorkflow({ origin, backend, fixture, expireSession: () =>
      db.query('UPDATE auth_sessions SET expiresAt = ? WHERE accountId = ?', [new Date(0), fixture.accounts[0].id]) });
  } else {
    throw new Error('Dùng baseline, migrate, recovery, runtime hoặc browser.');
  }
} finally {
  await stopBackend();
  await db.destroy();
}

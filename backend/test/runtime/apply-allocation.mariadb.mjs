import 'reflect-metadata';
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { resolve, sep } from 'node:path';
import { once } from 'node:events';
import { createServer, request } from 'node:http';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from '../../dist/database/database.config.js';
import { AddApplyAllocation1791260000000 } from '../../dist/database/migrations/1791260000000-add-apply-allocation.js';
import { getAvailabilityWeek } from '../../dist/employees/availability-week.js';
import { PasswordHasher } from '../../dist/auth/password.js';
import { decisionKey, issueDecisionEvidence } from '../../dist/projects/decision-context.js';
import { runChrome } from './apply-allocation.chrome.mjs';

const mode = process.argv[2] ?? 'runtime';
const options = createDataSourceOptions();
const expectedDirectory = resolve(process.env.PM006_CLONE_DATA_DIRECTORY ?? '');
assert.equal(options.host, '127.0.0.1');
assert.equal(options.port, 33308);
assert.match(options.database, /^rms_ai_pm006_(?:[a-z0-9]+_)?(?:clone|recovery)$/);
assert.ok(expectedDirectory.toLowerCase().startsWith((resolve('../.local/pm-allocation006') + sep).toLowerCase()));
const db = await new DataSource(mode === 'baseline' ? {
  ...options, migrations: options.migrations.filter(item => item !== AddApplyAllocation1791260000000),
} : options).initialize();
const baseline = ['projects', 'sprints', 'tasks', 'employees', 'skills',
  'employee_skills', 'user_accounts', 'auth_sessions', 'pm_decisions'];
let backend;
let requests = 0;

async function validateTarget() {
  const [row] = await db.query('SELECT DATABASE() AS db, @@port AS port, @@datadir AS dir, VERSION() AS version');
  assert.equal(row.db, options.database);
  assert.equal(Number(row.port), options.port);
  assert.equal(resolve(row.dir).toLowerCase(), expectedDirectory.toLowerCase());
  assert.match(row.version, /MariaDB/);
  return row.version;
}

async function fingerprint() {
  const result = {};
  for (const table of baseline) {
    const columns = await db.query(`SHOW COLUMNS FROM ${table}`);
    const pk = columns.filter(c => c.Key === 'PRI').map(c => c.Field);
    const rows = await db.query(`SELECT * FROM ${table} ORDER BY ${pk.join(',')}`);
    result[table] = [rows.length, createHash('sha256').update(JSON.stringify(rows)).digest('hex')];
  }
  return result;
}

async function migrate(recovery) {
  const before = await fingerprint();
  if (recovery) {
    assert.ok(options.database.endsWith('_recovery'));
    const runner = db.createQueryRunner();
    const original = runner.query.bind(runner);
    try {
      runner.query = async (sql, ...params) => {
        if (sql.startsWith('CREATE TABLE IF NOT EXISTS project_allocations')) throw new Error('fixture DDL interruption');
        return original(sql, ...params);
      };
      await assert.rejects(new AddApplyAllocation1791260000000().up(runner), /fixture DDL interruption/);
      assert.ok(await runner.hasTable('decision_availability_evidence'));
      assert.equal(await runner.hasTable('project_allocations'), false);
    } finally {
      await runner.release();
    }
  }
  const applied = await db.runMigrations({ transaction: 'each' });
  assert.deepEqual(applied.map(item => item.name), ['AddApplyAllocation1791260000000']);
  assert.deepEqual(await db.runMigrations({ transaction: 'each' }), []);
  assert.deepEqual(await fingerprint(), before);
  console.log(JSON.stringify({
    mode: recovery ? 'recovery' : 'migration', tablesUnchanged: baseline.length,
    counts: Object.fromEntries(Object.entries(before).map(([name, [count]]) => [name, count])),
  }));
}

const origin = 'http://127.0.0.1:5196';
const url = 'http://127.0.0.1:3196';
async function startBackend() {
  process.env.AUTH_MODE = 'local';
  process.env.AUTH_FRONTEND_ORIGIN = origin;
  process.env.AUTH_TRUSTED_PROXY_IPS = '';
  const [{ NestFactory }, { configureApp }, { AppModule }] = await Promise.all([
    import('@nestjs/core'), import('../../dist/app-config.js'), import('../../dist/app.module.js'),
  ]);
  backend = await NestFactory.create(AppModule, { logger: false });
  configureApp(backend);
  await backend.listen(3196, '127.0.0.1');
}

function failOneAllocation(stage) {
  const source = backend.get(DataSource);
  const createRunner = source.createQueryRunner.bind(source);
  let triggered = false;
  source.createQueryRunner = (...args) => {
    const runner = createRunner(...args);
    const query = runner.query.bind(runner);
    const commit = runner.commitTransaction.bind(runner);
    let inserted = false;
    runner.query = async (sql, ...parameters) => {
      if (!triggered && /INSERT INTO .?application_results/i.test(sql) && inserted && stage === 'between') {
        triggered = true;
        throw new Error('fixture interrupt between writes');
      }
      const value = await query(sql, ...parameters);
      if (/INSERT INTO .?project_allocations/i.test(sql)) inserted = true;
      return value;
    };
    runner.commitTransaction = async () => {
      if (inserted && !triggered && stage === 'commit') {
        triggered = true;
        const [row] = await query('SELECT CONNECTION_ID() AS id');
        const id = Number(row.id);
        assert.ok(Number.isSafeInteger(id) && id > 0);
        await db.query(`KILL CONNECTION ${id}`);
      }
      await commit();
    };
    return runner;
  };
  return () => {
    source.createQueryRunner = createRunner;
    assert.ok(triggered, `Fixture did not reach ${stage} fault injection.`);
  };
}

async function loseResponse(path, cookie) {
  const proxy = createServer((req, res) => {
    const upstream = request(url + path, { method: 'POST', headers: req.headers }, reply => {
      reply.resume();
      reply.once('end', () => res.destroy());
    });
    upstream.once('error', () => res.destroy());
    req.pipe(upstream);
  });
  proxy.listen(0, '127.0.0.1');
  await once(proxy, 'listening');
  try {
    requests++;
    await assert.rejects(fetch(`http://127.0.0.1:${proxy.address().port}`, {
      method: 'POST', body: '{}', headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    }));
  } finally {
    await new Promise(done => proxy.close(done));
  }
}

async function http(method, path, status, cookie = '', body) {
  requests++;
  const init = { method, headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/json' } };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(url + path, init);
  assert.ok(Array.isArray(status) ? status.includes(res.status) : status === res.status, `${method} ${path} received ${res.status}`);
  return { status: res.status, body: await res.json(), cookie: res.headers.get('set-cookie')?.split(';')[0] };
}

async function fixture() {
  const employee = randomUUID();
  const skill = randomUUID();
  const week = getAvailabilityWeek().weekStart;
  const projects = [randomUUID(), randomUUID()];
  const password = randomBytes(24).toString('base64url');
  const hash = await new PasswordHasher().hash(password);
  const accounts = ['PM', 'PM', 'HR', 'DEV'].map(role => ({ id: randomUUID(), role, password }));
  await db.query('INSERT INTO employees(id, displayName, availabilityWeekStart, availableHours) VALUES (?, ?, ?, ?)',
    [employee, 'Fixture 006', week, 0.3]);
  await db.query('INSERT INTO skills(id, name) VALUES (?, ?)', [skill, `Skill 006 ${skill.slice(0, 8)}`]);
  await db.query('INSERT INTO employee_skills(employeeId, skillId) VALUES (?, ?)', [employee, skill]);
  for (const a of accounts) {
    a.email = `${a.id}@fixture.invalid`;
    await db.query('INSERT INTO user_accounts(id,email,passwordHash,role,employeeId) VALUES (?,?,?,?,?)',
      [a.id, a.email, hash, a.role, a.role === 'DEV' ? employee : null]);
  }
  await db.query('INSERT INTO projects(id,name,pmAccountId) VALUES (?,?,?), (?,?,?)',
    [projects[0], 'Allocate 006 A', accounts[0].id, projects[1], 'Allocate 006 B', accounts[1].id]);
  return { employee, skill, week, projects, accounts };
}

async function runtime() {
  assert.ok(options.database.endsWith('_clone'));
  await startBackend();
  const f = await fixture();
  for (const account of f.accounts) {
    account.cookie = (await http('POST', '/auth/login', 200, '', { email: account.email, password: account.password })).cookie;
  }
  const [a, b, hr, dev] = f.accounts;
  const project = (index) => `/projects/${f.projects[index]}`;
  const route = (index, id) => `${project(index)}/decisions/${id}/apply`;
  const capacity = async () => (await http('GET', '/employees/availability', 200, hr.cookie)).body.employees
    .find(row => row.id === f.employee).capacity;
  const simulate = async (actor, index, support) => {
    const input = { skillId: f.skill, weekStart: f.week, requiredHours: 0.3 };
    const recommended = await http('POST', project(index) + '/resource-recommendations', 200, actor.cookie, input);
    const candidate = recommended.body.candidates.find(row => row.employeeId === f.employee);
    assert.ok(candidate);
    const simulated = await http('POST', project(index) + '/simulations', 200, actor.cookie, {
      runId: randomUUID(), scenario: { ...input, employeeId: f.employee, supportHours: support,
        recommendationContext: candidate.recommendationContext },
    });
    assert.equal(simulated.body.snapshotExact.availableHoursExact, candidate.availableHoursExact);
    assert.match(simulated.body.decisionEvidence.simulationToken, /^v2\./);
    return simulated.body;
  };
  const decision = async (actor, index, amount, choice = 'ACCEPT', result) => {
    const snapshot = result ?? await simulate(actor, index, amount);
    return (await http('POST', project(index) + '/decisions', 201, actor.cookie,
      { ...snapshot.decisionEvidence, decision: choice })).body.id;
  };
  assert.equal((await capacity()).remainingHoursExact, '3e-1');
  const reject = await decision(a, 0, 0.1, 'REJECT');
  await http('POST', route(0, reject), 409, a.cookie, {});
  const legacy = randomUUID();
  const legacySource = await simulate(a, 0, 0.1);
  await db.query(`INSERT INTO pm_decisions(id,simulationId,projectId,pmAccountId,decision,decidedAt,snapshot,expectedImpact,referenceDigest)
    VALUES (?,?,?,?, 'ACCEPT', NOW(3),?,?,?)`, [legacy, randomUUID(), f.projects[0], a.id,
    JSON.stringify(legacySource.snapshot), JSON.stringify(legacySource.expectedImpact), '0'.repeat(64)]);
  assert.equal((await http('POST', route(0, legacy), 409, a.cookie, {})).body.code, 'LEGACY_DECISION');
  const v2 = await simulate(a, 0, 0.1);
  await http('POST', project(0) + '/decisions', 400, a.cookie,
    { ...v2.decisionEvidence, simulationToken: v2.decisionEvidence.simulationToken.replace(/^v2\./, 'v1.'), decision: 'ACCEPT' });
  const provenanceCheck = await simulate(a, 0, 0.1);
  const provenanceInput = { ...provenanceCheck.decisionEvidence, decision: 'ACCEPT' };
  await db.query("CREATE TRIGGER pm006_clone_provenance BEFORE INSERT ON decision_availability_evidence FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'clone provenance rollback'");
  try {
    await http('POST', project(0) + '/decisions', 503, a.cookie, provenanceInput);
    const [row] = await db.query('SELECT COUNT(*) AS count FROM pm_decisions WHERE simulationId = ?', [provenanceInput.simulationId]);
    assert.equal(Number(row.count), 0);
  } finally {
    await db.query('DROP TRIGGER pm006_clone_provenance');
  }
  await http('POST', project(0) + '/decisions', 201, a.cookie, provenanceInput);
  await http('POST', project(0) + '/decisions', 200, a.cookie, provenanceInput);
  const legacyEvidence = issueDecisionEvidence(decisionKey(), a.id, {
    snapshot: v2.snapshot, expectedImpact: v2.expectedImpact,
  });
  const legacyInput = { ...legacyEvidence, decision: 'ACCEPT' };
  const lateLegacy = (await http('POST', project(0) + '/decisions', 201, a.cookie, legacyInput)).body;
  assert.equal((await http('POST', route(0, lateLegacy.id), 409, a.cookie, {})).body.code, 'LEGACY_DECISION');

  const da = await decision(a, 0, 0.2);
  const dbb = await decision(b, 1, 0.2);
  assert.equal((await capacity()).remainingHoursExact, '3e-1');
  for (const actor of [b, hr, dev]) await http('POST', route(0, da), 403, actor.cookie, {});
  const concurrent = await Promise.all([
    http('POST', route(0, da), [201, 409], a.cookie, {}),
    http('POST', route(1, dbb), [201, 409], b.cookie, {}),
  ]);
  assert.deepEqual(concurrent.map(row => row.status).sort(), [201, 409]);
  const remaining = await capacity();
  assert.equal(remaining.declaredHoursExact, '3e-1');
  assert.equal(remaining.remainingHoursExact, '1e-1');
  assert.deepEqual((await http('POST', project(0) + '/decisions', 200, a.cookie, legacyInput)).body, lateLegacy);
  const stale = { ...v2.decisionEvidence, decision: 'ACCEPT' };
  assert.equal((await http('POST', project(0) + '/decisions', 409, a.cookie, stale)).body.code, 'STALE_SIMULATION');
  const same = await decision(a, 0, 0.1);
  await db.query('UPDATE projects SET pmAccountId = ? WHERE id = ?', [b.id, f.projects[0]]);
  await db.query('DELETE FROM employee_skills WHERE employeeId = ? AND skillId = ?', [f.employee, f.skill]);
  assert.equal((await http('POST', route(0, same), 409, b.cookie, {})).body.code, 'STALE_ALLOCATION');
  await db.query('INSERT INTO employee_skills(employeeId, skillId) VALUES (?, ?)', [f.employee, f.skill]);
  await db.query("UPDATE employees SET availabilityWeekStart = DATE_ADD(availabilityWeekStart, INTERVAL 7 DAY) WHERE id = ?", [f.employee]);
  assert.equal((await http('POST', route(0, same), 409, b.cookie, {})).body.code, 'AVAILABILITY_MISSING');
  await db.query('UPDATE employees SET availabilityWeekStart = ? WHERE id = ?', [f.week, f.employee]);
  const repeated = await Promise.all([
    http('POST', route(0, same), [200, 201], b.cookie, {}),
    http('POST', route(0, same), [200, 201], b.cookie, {}),
  ]);
  assert.deepEqual(repeated.map(row => row.status).sort(), [200, 201]);
  assert.equal(repeated[0].body.id, repeated[1].body.id);
  assert.equal(repeated[0].body.decidedByAccountId, a.id);
  assert.equal(repeated[0].body.appliedByAccountId, b.id);
  assert.equal((await capacity()).status, 'EXHAUSTED');
  const [stored] = await db.query('SELECT hoursExact FROM project_allocations WHERE id = ?', [repeated[0].body.id]);
  assert.equal(stored.hoursExact, '1e-1');
  await assert.rejects(db.query(`INSERT INTO project_allocations
    SELECT ?,decisionId,projectId,employeeId,skillId,weekStart,hoursExact,appliedByAccountId,appliedAt
    FROM project_allocations WHERE id = ?`, [randomUUID(), repeated[0].body.id]), error => error.errno === 1062);
  await assert.rejects(db.query(`INSERT INTO application_results
    (id,decisionId,actorAccountId,allocationId,outcome,code,occurredAt) VALUES (?,?,?,NULL,'APPLIED',NULL,NOW(3))`,
  [randomUUID(), same, b.id]), error => error.errno === 4025);
  await assert.rejects(db.query(`INSERT INTO decision_availability_evidence
    (decisionId,semantics,availableHoursExact,supportHoursExact) VALUES (?,'remaining-v1','3e-1','1e-1')`,
  [randomUUID()]), error => error.errno === 1452);
  const scoped = (await http('GET', project(0) + '/allocation-results', 200, b.cookie)).body;
  assert.ok(scoped.items.find(row => row.allocation?.id === repeated[0].body.id));
  const decisions = (await http('GET', project(0) + '/decisions', 200, b.cookie)).body.items;
  const savedDecision = decisions.find(row => row.id === same);
  assert.equal(savedDecision.allocationState, 'APPLIED');
  assert.equal(savedDecision.snapshotExact.supportHoursExact, repeated[0].body.hoursExact);
  assert.equal(savedDecision.expectedImpactExact.remainingAvailableHours, '0');
  await http('GET', project(0) + '/allocation-results', 403, a.cookie);
  await http('GET', project(0) + '/allocation-results', 403, hr.cookie);
  await http('GET', project(0) + '/allocation-results', 403, dev.cookie);
  await http('GET', '/employees/availability', 403, dev.cookie);
  const profile = (await http('GET', '/auth/me/employee', 200, dev.cookie)).body;
  assert.equal(profile.employee.id, f.employee);
  assert.equal(profile.workContext.status, 'unavailable');
  const untouched = await db.query('SELECT COUNT(*) AS count FROM project_allocations WHERE employeeId = ?', [f.employee]);
  assert.equal(Number(untouched[0].count), 2);
  await db.query('UPDATE employees SET availableHours = 0.2 WHERE id = ?', [f.employee]);
  assert.equal((await capacity()).remainingHoursExact, '-1e-1');
  await db.query('UPDATE employees SET availableHours = NULL WHERE id = ?', [f.employee]);
  assert.equal((await capacity()).remainingHoursExact, null);
  await backend.close();
  backend = undefined;
  await startBackend();
  assert.equal((await http('GET', route(0, same), 200, b.cookie)).body.id, repeated[0].body.id);
  assert.equal((await http('POST', route(0, same), 200, b.cookie, {})).body.id, repeated[0].body.id);
  await db.query('UPDATE employees SET availableHours = 1 WHERE id = ?', [f.employee]);
  const interrupted = await decision(b, 0, 0.1);
  for (const [stage, code] of [['between', 'APPLICATION_RETRYABLE'], ['commit', 'APPLICATION_UNCONFIRMED']]) {
    const restore = failOneAllocation(stage);
    try {
      assert.equal((await http('POST', route(0, interrupted), 503, b.cookie, {})).body.code, code);
    } finally {
      restore();
    }
    const observed = (await http('GET', route(0, interrupted), 200, b.cookie)).body;
    assert.deepEqual(observed, { decisionId: interrupted, status: 'NOT_APPLIED', latestFailure: null });
    assert.equal((await capacity()).remainingHoursExact, '7e-1');
  }
  await backend.close();
  backend = undefined;
  await startBackend();
  assert.equal((await http('GET', route(0, interrupted), 200, b.cookie)).body.status, 'NOT_APPLIED');
  await loseResponse(route(0, interrupted), b.cookie);
  const confirmed = (await http('GET', route(0, interrupted), 200, b.cookie)).body;
  assert.equal(confirmed.status, 'APPLIED');
  assert.equal((await http('POST', route(0, interrupted), 200, b.cookie, {})).body.id, confirmed.id);
  assert.equal((await capacity()).remainingHoursExact, '6e-1');
  console.log(JSON.stringify({ runtime: 'NestJS/MariaDB', requests, concurrency: [201, 409], replay: [200, 201],
    restart: true, rollback: true, disconnectedCommit: true, lostResponse: true }));
}

try {
  const version = await validateTarget();
  if (mode === 'baseline') {
    await db.runMigrations({ transaction: 'each' });
    const f = await fixture();
    await db.query('INSERT INTO auth_sessions(tokenDigest,accountId,expiresAt) VALUES (?,?,?)',
      [randomBytes(32).toString('hex'), f.accounts[0].id, new Date(Date.now() + 60_000)]);
    const snapshot = { projectId: f.projects[0], employeeId: f.employee, skillId: f.skill,
      weekStart: f.week, requiredHours: 0.3, availableHours: 0.3, supportHours: 0.1 };
    const impact = { hypotheticalSupportHours: 0.1, remainingRequiredHours: 0.2, remainingAvailableHours: 0.2 };
    await db.query(`INSERT INTO pm_decisions(id,simulationId,projectId,pmAccountId,decision,decidedAt,snapshot,expectedImpact,referenceDigest)
      VALUES (?,?,?,?, 'ACCEPT', NOW(3),?,?,?)`, [randomUUID(), randomUUID(), f.projects[0], f.accounts[0].id,
      JSON.stringify(snapshot), JSON.stringify(impact), randomBytes(32).toString('hex')]);
    console.log(JSON.stringify({ baseline: '003', target: options.database, version }));
  } else if (mode === 'migration' || mode === 'recovery') await migrate(mode === 'recovery');
  else if (mode === 'runtime') await runtime();
  else if (mode === 'browser') {
    assert.ok(options.database.endsWith('_clone'));
    await startBackend();
    const browserFixture = await fixture();
    await db.query('UPDATE projects SET pmAccountId = ? WHERE id = ?', [browserFixture.accounts[0].id, browserFixture.projects[1]]);
    await runChrome(browserFixture, origin, url);
  } else throw new Error('Chọn baseline, migration, recovery, runtime hoặc browser.');
} finally {
  await backend?.close();
  await db.destroy();
}

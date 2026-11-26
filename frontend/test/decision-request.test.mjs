import assert from 'node:assert/strict'
import test from 'node:test'
import { DecisionRequest } from '../src/projects/decisionRequest.ts'

const projectId = 'project'
const evidence = { simulationId: 'simulation', simulationToken: 'verified-evidence' }
const success = (decision = 'ACCEPT') => Response.json({
  ...evidence, id: 'decision', projectId, decision, pmAccountId: 'pm', decidedAt: new Date().toISOString(),
  snapshot: { projectId, employeeId: 'employee', skillId: 'skill', weekStart: '2026-11-16',
    requiredHours: 3, supportHours: 1, availableHours: 2 },
  expectedImpact: { hypotheticalSupportHours: 1, remainingRequiredHours: 2, remainingAvailableHours: 1 },
}, { status: 200 })

test('blocks duplicate clicks and replays the identical selection after a lost response', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const bodies = []
  const states = []
  const send = async (_project, body) => {
    bodies.push(body)
    return bodies.length === 1 ? new Promise(() => {}) : success()
  }
  const request = new DecisionRequest(projectId, evidence, send, 10)
  const first = request.execute('ACCEPT', state => states.push(state.status))
  await request.execute('REJECT', state => states.push(state.status))
  assert.deepEqual(states, ['pending'])
  t.mock.timers.tick(10)
  await first
  await request.execute('REJECT', state => states.push(state.status))
  await request.retry(state => states.push(state.status))
  assert.deepEqual(states, ['pending', 'error', 'pending', 'saved'])
  assert.deepEqual(bodies, [{ ...evidence, decision: 'ACCEPT' }, { ...evidence, decision: 'ACCEPT' }])
})

test('keeps stale, conflicting, invalid and expired requests terminal', async () => {
  for (const [status, code, expected] of [
    [409, 'STALE_SIMULATION', 'stale'], [409, 'DECISION_CONFLICT', 'conflict'],
    [401, 'UNAUTHENTICATED', 'expired'], [403, 'FORBIDDEN', 'forbidden'],
    [400, 'INVALID_SIMULATION_EVIDENCE', 'invalid'],
  ]) {
    const seen = []
    const request = new DecisionRequest(projectId, evidence, async () => Response.json({ code }, { status }))
    await request.execute('REJECT', value => seen.push(value.status))
    await request.retry(value => seen.push(value.status))
    assert.deepEqual(seen, ['pending', expected])
  }
})

test('drops a late result after the selection, Project or session has been invalidated', async () => {
  let finish
  const states = []
  const request = new DecisionRequest(projectId, evidence, () => new Promise(resolve => { finish = resolve }))
  const first = request.execute('ACCEPT', state => states.push(state.status))
  request.invalidate()
  finish(success())
  await first
  assert.deepEqual(states, ['pending'])
})

test('a malformed successful response cannot show a stored decision', async () => {
  const states = []
  const request = new DecisionRequest(projectId, evidence, async () => success('REJECT'))
  await request.execute('ACCEPT', state => states.push(state.status))
  assert.deepEqual(states, ['pending', 'error'])
})

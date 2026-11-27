import assert from 'node:assert/strict'
import test from 'node:test'
import { recommendationPresentation, SimulationRun } from '../src/projects/simulationRun.ts'

const scenario = {
  projectId: 'project-a',
  employeeId: 'employee-a',
  skillId: 'skill-a',
  weekStart: '2026-11-16',
  requiredHours: 8,
  supportHours: 8,
  recommendationContext: 'proof',
}

function success(input, runId) {
  const { recommendationContext: _proof, ...context } = input
  return Response.json({
    outcome: 'available',
    runId,
    scenarioReference: 'a'.repeat(64),
    snapshot: { ...context, availableHours: 12.5 },
    expectedImpact: {
      hypotheticalSupportHours: input.supportHours,
      remainingRequiredHours: Math.max(input.requiredHours - input.supportHours, 0),
      remainingAvailableHours: 12.5 - input.supportHours,
    },
  })
}

function controlledRequests() {
  const calls = []
  return {
    calls,
    send: (input, runId, signal) => new Promise((resolve, reject) => {
      calls.push({ input, runId, signal, resolve, reject })
    }),
  }
}

test('classifies empty and missing recommendation separately and handles old responses', () => {
  assert.equal(recommendationPresentation('unavailable', 0), 'missing')
  assert.equal(recommendationPresentation('no_suitable_candidate', 0), 'empty')
  assert.equal(recommendationPresentation(undefined, 0), 'empty')
  assert.equal(recommendationPresentation(undefined, 1), 'candidates')
})

test('publishes decision evidence only for a matching successful simulation with a valid evidence shape', async () => {
  const run = new SimulationRun()
  const states = []
  const decisionEvidence = { simulationId: crypto.randomUUID(), simulationToken: `v1.eA.${'b'.repeat(43)}` }
  for (const [evidence, matching, expected] of [
    [decisionEvidence, true, decisionEvidence],
    [{ ...decisionEvidence, simulationToken: 'candidate-proof' }, true, undefined],
    [decisionEvidence, false, undefined],
  ]) {
    await run.execute(scenario, state => states.push(state), async (input, id) => {
      const body = await success(input, matching ? id : 'wrong-run').json()
      return Response.json({ ...body, decisionEvidence: evidence })
    })
    assert.equal(states.at(-1).status, matching ? 'success' : 'error')
    assert.deepEqual(states.at(-1).evidence, expected)
  }
})

test('checks exact support even when another decimal projects to the same JSON number', async () => {
  const run = new SimulationRun()
  const input = { ...scenario, supportHours: 1, supportHoursExact: '99999999999999999e-17' }
  const evidence = { simulationId: crypto.randomUUID(), simulationToken: `v2.eA.${'b'.repeat(43)}` }
  for (const supportHoursExact of [input.supportHoursExact, '1e0']) {
    let observed
    await run.execute(input, state => { observed = state }, async (value, id) => {
      const body = await success(value, id).json()
      delete body.snapshot.supportHoursExact
      return Response.json({ ...body, decisionEvidence: evidence,
        snapshotExact: { availableHoursExact: '125e-1', supportHoursExact },
        expectedImpactExact: {
          hypotheticalSupportHours: supportHoursExact, remainingRequiredHours: '7e0', remainingAvailableHours: '115e-1',
        },
      })
    })
    assert.equal(observed.status, supportHoursExact === input.supportHoursExact ? 'success' : 'error')
  }
})

test('classifies HTTP errors and retries with the same draft and a fresh runId', async () => {
  const run = new SimulationRun()
  const { send, calls } = controlledRequests()
  const states = []
  const publish = state => states.push(state)
  const visitedIds = new Set()
  for (const [status, expected] of [[400, 'invalid'], [404, 'invalid'], [422, 'missing'], [503, 'error']]) {
    const result = run.execute(scenario, publish, send)
    const call = calls.at(-1)
    assert.deepEqual(call.input, scenario)
    assert.equal(visitedIds.has(call.runId), false)
    visitedIds.add(call.runId)
    call.resolve(Response.json({ message: 'test' }, { status }))
    await result
    assert.equal(states.at(-1).status, expected)
  }
  const result = run.execute(scenario, publish, send)
  const call = calls.at(-1)
  assert.equal(visitedIds.has(call.runId), false)
  call.resolve(success(call.input, call.runId))
  await result
  assert.deepEqual(states.at(-1), {
    status: 'success',
    impact: { hypotheticalSupportHours: 8, remainingRequiredHours: 0, remainingAvailableHours: 4.5 },
  })
})

test('rejects a response with the wrong run, stale snapshot or malformed impact', async () => {
  const run = new SimulationRun()
  const states = []
  const publish = state => states.push(state)
  await run.execute(scenario, publish, input => success(input, 'wrong-run'))
  assert.equal(states.at(-1).status, 'error')
  await run.execute(scenario, publish, (input, id) => success({ ...input, projectId: 'old-project' }, id))
  assert.equal(states.at(-1).status, 'error')
  await run.execute(scenario, publish, async (input, id) => {
    const body = await success(input, id).json()
    body.expectedImpact.remainingAvailableHours = '4.5'
    return Response.json(body)
  })
  assert.equal(states.at(-1).status, 'error')
})

test('times out stalled transport and retries without accepting the late response', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const run = new SimulationRun()
  const { send, calls } = controlledRequests()
  const states = []
  const publish = state => states.push(state)
  const first = run.execute(scenario, publish, send)
  t.mock.timers.tick(10_000)
  assert.equal(calls[0].signal.aborted, true)
  await first
  assert.equal(states.at(-1).status, 'error')

  const retry = run.execute(scenario, publish, send)
  assert.deepEqual(calls[1].input, scenario)
  assert.notEqual(calls[1].runId, calls[0].runId)
  calls[0].resolve(success(scenario, calls[0].runId))
  calls[1].resolve(success(scenario, calls[1].runId))
  await retry
  assert.deepEqual(states.map(({ status }) => status), ['loading', 'error', 'loading', 'success'])
})

test('bounds the wait for a response body after headers arrive', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const run = new SimulationRun()
  const states = []
  let readingBody
  const bodyReadStarted = new Promise(resolve => { readingBody = resolve })
  const result = run.execute(scenario, state => states.push(state), async () => ({
    ok: true,
    status: 200,
    json: () => {
      readingBody()
      return new Promise(() => {})
    },
  }))
  await bodyReadStarted
  t.mock.timers.tick(10_000)
  await result
  assert.deepEqual(states.map(({ status }) => status), ['loading', 'error'])
})

for (const [field, next] of Object.entries({
  projectId: 'new-project', employeeId: 'new-employee', skillId: 'new-skill',
  weekStart: '2026-11-23', requiredHours: 6, supportHours: 4,
})) {
  test(`changing ${field} invalidates A even when returning to its value`, async () => {
    const run = new SimulationRun()
    const { send, calls } = controlledRequests()
    const states = []
    const publish = state => states.push(state)
    const first = run.execute(scenario, publish, send)
    run.invalidate()
    const second = run.execute({ ...scenario, [field]: next }, publish, send)
    run.invalidate()
    const third = run.execute(scenario, publish, send)
    calls[0].resolve(success(scenario, calls[0].runId))
    calls[1].reject(new Error('obsolete error'))
    await Promise.all([first, second])
    assert(calls[0].signal.aborted)
    assert(calls[1].signal.aborted)
    assert.equal(states.at(-1).status, 'loading')
    calls[2].resolve(success(scenario, calls[2].runId))
    await third
    assert.equal(states.at(-1).status, 'success')
    assert.equal(states.filter(({ status }) => status === 'success').length, 1)
  })
}

for (const late of ['success', 'error']) {
  for (const current of ['pending', 'success', 'error']) {
    test(`late A ${late} cannot overwrite B ${current}`, async () => {
      const run = new SimulationRun()
      const { send, calls } = controlledRequests()
      const states = []
      const publish = state => states.push(state)
      const first = run.execute(scenario, publish, send)
      const other = { ...scenario, supportHours: 4 }
      const second = run.execute(other, publish, send)
      if (current !== 'pending') {
        if (current === 'success') calls[1].resolve(success(other, calls[1].runId))
        else calls[1].reject(new Error('current failure'))
        await second
      }
      if (late === 'success') calls[0].resolve(success(scenario, calls[0].runId))
      else calls[0].reject(new Error('obsolete failure'))
      await first
      assert.equal(states.at(-1).status, current === 'pending' ? 'loading' : current)
      if (current === 'pending') {
        calls[1].resolve(success(other, calls[1].runId))
        await second
        assert.equal(states.at(-1).impact.hypotheticalSupportHours, 4)
      }
    })
  }
}

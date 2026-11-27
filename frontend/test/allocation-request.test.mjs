import assert from 'node:assert/strict'
import test from 'node:test'
import { AllocationRequest } from '../src/projects/allocationRequest.ts'
import { displayExactHours, parseHoursInput } from '../src/layout/exactHours.ts'

const projectId = 'project'
const decisionId = 'decision'
const allocation = {
  id: 'allocation', decisionId, projectId, employeeId: 'employee', skillId: 'skill',
  weekStart: '2026-11-23', hoursExact: '3e-1', decidedByAccountId: 'old-pm',
  appliedByAccountId: 'new-pm', appliedAt: '2026-11-23T00:01:00.000Z', status: 'APPLIED',
}

test('reports unknown and reconciles a committed response without a second POST', async () => {
  const methods = []
  const request = new AllocationRequest(projectId, decisionId, async (_url, { method }) => {
    methods.push(method)
    return method === 'POST' ? Response.json({ code: 'APPLICATION_UNCONFIRMED' }, { status: 503 }) : Response.json(allocation)
  })
  const states = []
  const emit = state => states.push(state)
  await request.run('POST', emit)
  await request.run('GET', emit)
  assert.deepEqual(methods, ['POST', 'GET'])
  assert.deepEqual(states.map(x => x.status), ['pending', 'unconfirmed', 'pending', 'applied'])
  assert.equal(states.at(-1).allocation.id, 'allocation')
})

test('discards a late result and does not start a second request while pending', async () => {
  let deliver
  let calls = 0
  const states = []
  const request = new AllocationRequest(projectId, decisionId, () => {
    calls++
    return new Promise(resolve => { deliver = resolve })
  })
  const pending = request.run('POST', state => states.push(state.status))
  await request.run('POST', state => states.push(state.status))
  request.invalidate()
  deliver(Response.json(allocation))
  await pending
  assert.deepEqual(states, ['pending'])
  assert.equal(calls, 1)
})

test('renders decimal hours without rounding the signed quantity', () => {
  assert.equal(displayExactHours('99999999999999999e-17'), '0,99999999999999999')
  assert.equal(displayExactHours('-1e-1'), '-0,1')
  assert.equal(parseHoursInput('0.99999999999999999'), '99999999999999999e-17')
})

test('keeps outcome unconfirmed when reconciliation cannot read the decision', async () => {
  const request = new AllocationRequest(projectId, decisionId, async () =>
    Response.json({ message: 'Forbidden' }, { status: 403 }))
  const states = []
  await request.run('GET', state => states.push(state.status))
  assert.deepEqual(states, ['pending', 'unconfirmed'])
})

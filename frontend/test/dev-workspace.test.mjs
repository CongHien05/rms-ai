import assert from 'node:assert/strict'
import test from 'node:test'
import { devProfilePath, readDevProfile } from '../src/dev-workspace/dev-profile.ts'

test('reads only the personal endpoint and displays the issued profile and skills', () => {
  assert.equal(devProfilePath, '/api/auth/me/employee')
  assert.deepEqual(readDevProfile({
    employee: { id: 'fixture-id', displayName: 'Fixture DEV A', availableHours: 4 },
    skills: [{ id: 'fixture-skill', name: 'Fixture skill' }],
    workContext: { status: 'unavailable' },
  }), {
    employee: { id: 'fixture-id', displayName: 'Fixture DEV A' },
    skills: [{ id: 'fixture-skill', name: 'Fixture skill' }],
    workContext: { status: 'unavailable' },
  })
})

test('rejects a missing identity or a work context outside the approved milestone', () => {
  const base = { employee: { id: 'fixture-id', displayName: 'Fixture DEV' }, skills: [] }
  assert.throws(() => readDevProfile({ ...base, employee: null, workContext: { status: 'unavailable' } }))
  assert.throws(() => readDevProfile({ ...base, workContext: { status: 'assigned', tasks: [] } }))
})

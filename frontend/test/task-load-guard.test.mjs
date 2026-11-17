import assert from 'node:assert/strict'
import test from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'
import { TaskLoadGuard } from '../src/projects/taskLoadGuard.ts'

test('ignores a delayed GET response after a PATCH succeeds', async () => {
  const guard = new TaskLoadGuard()
  const loadRevision = guard.beginLoad()
  assert.notEqual(loadRevision, null)

  let status = 'TODO'
  const delayedGet = delay(30, 'TODO').then(staleStatus => {
    if (guard.canApplyLoad(loadRevision)) status = staleStatus
  })

  await delay(5)
  guard.beginUpdate()
  await delay(5)
  status = 'DONE'
  guard.finishUpdate()

  await delayedGet
  assert.equal(status, 'DONE')
})

test('blocks a new GET while a PATCH is in progress', () => {
  const guard = new TaskLoadGuard()

  guard.beginUpdate()
  assert.equal(guard.beginLoad(), null)

  guard.finishUpdate()
  assert.equal(typeof guard.beginLoad(), 'number')
})

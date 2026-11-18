import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyConfirmedTaskUpdate,
  buildTaskPlanningPayload,
} from '../src/projects/taskPlanning.ts'

test('builds nullable planning fields for an empty form', () => {
  assert.deepEqual(buildTaskPlanningPayload('', '  '), {
    dueDate: null,
    estimatedHours: null,
  })
})

test('accepts a valid date and decimal estimated hours', () => {
  assert.deepEqual(buildTaskPlanningPayload('2026-12-15', '3.5'), {
    dueDate: '2026-12-15',
    estimatedHours: 3.5,
  })
})

test('rejects invalid dates and non-positive or non-finite hours', () => {
  assert.throws(
    () => buildTaskPlanningPayload('2026-02-30', '3'),
    /ngày hợp lệ/,
  )
  assert.throws(() => buildTaskPlanningPayload('', '0'), /lớn hơn 0/)
  assert.throws(() => buildTaskPlanningPayload('', '-1'), /lớn hơn 0/)
  assert.throws(() => buildTaskPlanningPayload('', 'Infinity'), /hữu hạn/)
})

test('applies only the complete Task confirmed by the API', () => {
  const tasks = [
    {
      id: 'task-1', status: 'TODO', dueDate: null, estimatedHours: null,
    },
    {
      id: 'task-2', status: 'BLOCKED', dueDate: null, estimatedHours: 2,
    },
  ]
  const confirmed = {
    id: 'task-1', status: 'TODO', dueDate: '2026-12-15', estimatedHours: 3.5,
  }

  const updated = applyConfirmedTaskUpdate(tasks, confirmed)

  assert.deepEqual(updated, [confirmed, tasks[1]])
  assert.equal(tasks[0].dueDate, null)
})

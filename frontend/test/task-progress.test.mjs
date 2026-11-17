import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyConfirmedTaskStatus,
  summarizeTaskProgress,
} from '../src/projects/taskProgress.ts'

test('calculates task counts and rounds completion rate to an integer', () => {
  const progress = summarizeTaskProgress([
    { status: 'DONE' },
    { status: 'DONE' },
    { status: 'BLOCKED' },
  ])

  assert.deepEqual(progress, {
    total: 3,
    completed: 2,
    blocked: 1,
    completionRate: 67,
  })
})

test('returns zero progress for an empty sprint', () => {
  assert.deepEqual(summarizeTaskProgress([]), {
    total: 0,
    completed: 0,
    blocked: 0,
    completionRate: 0,
  })
})

test('recalculates progress after a confirmed status update', () => {
  const tasks = [
    { id: 'task-1', status: 'TODO', title: 'Task 1' },
    { id: 'task-2', status: 'BLOCKED', title: 'Task 2' },
  ]
  const updatedTasks = applyConfirmedTaskStatus(tasks, 'task-1', 'DONE')

  assert.deepEqual(summarizeTaskProgress(updatedTasks), {
    total: 2,
    completed: 1,
    blocked: 1,
    completionRate: 50,
  })
  assert.equal(tasks[0].status, 'TODO')
})

test('keeps progress from the last confirmed data when an update fails', () => {
  const confirmedTasks = [
    { id: 'task-1', status: 'IN_PROGRESS' },
    { id: 'task-2', status: 'BLOCKED' },
  ]

  const beforeFailure = summarizeTaskProgress(confirmedTasks)
  const restoredTasks = applyConfirmedTaskStatus(
    confirmedTasks,
    'task-1',
    'IN_PROGRESS',
  )
  const afterFailure = summarizeTaskProgress(restoredTasks)

  assert.deepEqual(afterFailure, beforeFailure)
})

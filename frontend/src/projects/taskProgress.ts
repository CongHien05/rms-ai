export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'

type TaskStatusInput = {
  status: TaskStatus
}

type IdentifiedTaskStatusInput = TaskStatusInput & {
  id: string
}

export type TaskProgress = {
  total: number
  completed: number
  blocked: number
  completionRate: number
}

export function summarizeTaskProgress(
  tasks: readonly TaskStatusInput[],
): TaskProgress {
  const total = tasks.length
  const completed = tasks.filter(task => task.status === 'DONE').length
  const blocked = tasks.filter(task => task.status === 'BLOCKED').length

  return {
    total,
    completed,
    blocked,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}

export function applyConfirmedTaskStatus<T extends IdentifiedTaskStatusInput>(
  tasks: readonly T[],
  taskId: string,
  status: TaskStatus,
): T[] {
  return tasks.map(task => (
    task.id === taskId ? { ...task, status } : task
  ))
}

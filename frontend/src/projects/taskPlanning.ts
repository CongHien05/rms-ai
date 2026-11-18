export type TaskPlanningPayload = {
  dueDate: string | null
  estimatedHours: number | null
}

function isValidDateOnly(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

export function buildTaskPlanningPayload(
  dueDateInput: string,
  estimatedHoursInput: string,
): TaskPlanningPayload {
  const dueDate = dueDateInput.trim()
  if (dueDate && !isValidDateOnly(dueDate)) {
    throw new Error('Hạn hoàn thành phải là ngày hợp lệ theo định dạng YYYY-MM-DD.')
  }

  const estimatedText = estimatedHoursInput.trim()
  const estimatedHours = estimatedText === '' ? null : Number(estimatedText)
  if (
    estimatedHours !== null
    && (!Number.isFinite(estimatedHours) || estimatedHours <= 0)
  ) {
    throw new Error('Số giờ ước tính phải là số hữu hạn lớn hơn 0.')
  }

  return {
    dueDate: dueDate || null,
    estimatedHours,
  }
}

export function applyConfirmedTaskUpdate<T extends { id: string }>(
  tasks: readonly T[],
  updatedTask: T,
): T[] {
  return tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
}

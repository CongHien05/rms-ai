export const devProfilePath = '/api/auth/me/employee'

function isNamedRow<Label extends 'displayName' | 'name'>(value: unknown, label: Label): value is Record<Label | 'id', string> {
  if (!value || typeof value !== 'object' || !('id' in value) || typeof value.id !== 'string' || !(label in value)) {
    return false
  }
  return typeof (value as Record<string, unknown>)[label] === 'string'
}

export function readDevProfile(data: unknown) {
  if (!data || typeof data !== 'object' || !('employee' in data) || !isNamedRow(data.employee, 'displayName') ||
      !('skills' in data) || !Array.isArray(data.skills) || !data.skills.every(skill => isNamedRow(skill, 'name')) ||
      !('workContext' in data) || !data.workContext || typeof data.workContext !== 'object' ||
      !('status' in data.workContext) || data.workContext.status !== 'unavailable') {
    throw new Error('Hồ sơ cá nhân không đúng định dạng.')
  }
  return {
    employee: { id: data.employee.id, displayName: data.employee.displayName },
    skills: data.skills.map(skill => ({ id: skill.id, name: skill.name })),
    workContext: { status: 'unavailable' as const },
  }
}

import { apiFetch } from '../auth/session.ts'
import { exactHoursInput } from '../layout/exactHours.ts'

export type Allocation = {
  id: string; decisionId: string; projectId: string; employeeId: string; skillId: string
  weekStart: string; hoursExact: string; decidedByAccountId: string; appliedByAccountId: string
  appliedAt: string; status: 'APPLIED'
}

export function isAllocation(value: unknown, projectId: string, decisionId: string): value is Allocation {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return row.projectId === projectId && row.decisionId === decisionId && row.status === 'APPLIED' &&
    typeof row.hoursExact === 'string' && exactHoursInput(row.hoursExact) !== '' &&
    !row.hoursExact.startsWith('-') && row.hoursExact !== '0' &&
    ['id', 'employeeId', 'skillId', 'weekStart', 'decidedByAccountId', 'appliedByAccountId'].every(key => typeof row[key] === 'string') &&
    typeof row.appliedAt === 'string' && Number.isFinite(Date.parse(row.appliedAt))
}

export type ApplyState =
  | { status: 'pending' | 'available' }
  | { status: 'applied'; allocation: Allocation }
  | { status: 'failed' | 'unconfirmed' | 'retryable'; message: string }

const unknown: ApplyState = { status: 'unconfirmed', message: 'Chưa xác nhận được kết quả. Hãy đối chiếu với máy chủ.' }

export class AllocationRequest {
  private active: AbortController | undefined
  private readonly projectId: string
  private readonly decisionId: string
  private readonly send: typeof apiFetch
  private readonly timeoutMs: number

  constructor(projectId: string, decisionId: string, send: typeof apiFetch = apiFetch, timeoutMs = 10_000) {
    this.projectId = projectId
    this.decisionId = decisionId
    this.send = send
    this.timeoutMs = timeoutMs
  }

  invalidate() {
    this.active?.abort()
    this.active = undefined
  }

  async run(method: 'POST' | 'GET', emit: (state: ApplyState) => void) {
    if (this.active) return
    const request = new AbortController()
    this.active = request
    emit({ status: 'pending' })
    const deadline = new Promise<never>((_, reject) => {
      request.signal.addEventListener('abort', () => reject(request.signal.reason), { once: true })
    })
    const timer = setTimeout(() => request.abort(), this.timeoutMs)
    try {
      const fetchResult = async () => {
        const res = await this.send(`/api/projects/${this.projectId}/decisions/${this.decisionId}/apply`, {
          method, signal: request.signal,
          ...(method === 'POST' ? { headers: { 'Content-Type': 'application/json' }, body: '{}' } : {}),
        })
        return { res, body: await res.json().catch(() => null) }
      }
      const { res, body } = await Promise.race([fetchResult(), deadline])
      if (this.active !== request) return
      if (res.ok && isAllocation(body, this.projectId, this.decisionId)) {
        emit({ status: 'applied', allocation: body })
      } else if (method === 'GET' && res.ok && body?.status === 'NOT_APPLIED' && body.decisionId === this.decisionId) {
        emit({ status: 'retryable', message: 'Tại thời điểm đối chiếu chưa ghi nhận phân bổ. Có thể thử lại cùng quyết định.' })
      } else if (res.status === 503 && body?.code === 'APPLICATION_RETRYABLE' && method === 'POST') {
        emit({ status: 'retryable', message: 'Chưa ghi phân bổ. Có thể thử lại cùng quyết định.' })
      } else if (method === 'POST' && res.status >= 400 && res.status < 500) {
        emit({ status: 'failed', message: typeof body?.message === 'string' ? body.message : 'Yêu cầu áp dụng bị từ chối.' })
      } else {
        emit(unknown)
      }
    } catch {
      if (this.active === request) emit(unknown)
    } finally {
      clearTimeout(timer)
      if (this.active === request) this.active = undefined
    }
  }
}

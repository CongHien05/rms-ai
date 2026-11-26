import { apiFetch } from '../auth/session.ts'
import type { DecisionEvidence, Impact } from './simulationRun.ts'

export type DecisionChoice = 'ACCEPT' | 'REJECT'
export type DecisionRecord = {
  id: string
  simulationId: string
  projectId: string
  pmAccountId: string
  decision: DecisionChoice
  decidedAt: string
  snapshot: {
    projectId: string
    employeeId: string
    skillId: string
    weekStart: string
    requiredHours: number
    supportHours: number
    availableHours: number
  }
  expectedImpact: Impact
}

export type DecisionState =
  | { status: 'idle' | 'pending' }
  | { status: 'saved'; record: DecisionRecord }
  | { status: 'error' | 'stale' | 'conflict' | 'forbidden' | 'expired' | 'invalid'; message: string }

type Send = (projectId: string, body: DecisionEvidence & { decision: DecisionChoice }, signal: AbortSignal) => Promise<Response>

function sendDecision(projectId: string, body: DecisionEvidence & { decision: DecisionChoice }, signal: AbortSignal) {
  return apiFetch(`/api/projects/${projectId}/decisions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal,
  })
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function isDecisionRecord(value: unknown, projectId: string): value is DecisionRecord {
  if (!object(value) || value.projectId !== projectId ||
    typeof value.id !== 'string' || typeof value.simulationId !== 'string' || typeof value.pmAccountId !== 'string' ||
    typeof value.decidedAt !== 'string' || !Number.isFinite(Date.parse(value.decidedAt)) ||
    (value.decision !== 'ACCEPT' && value.decision !== 'REJECT') ||
    !object(value.snapshot) || !object(value.expectedImpact)) return false
  const { snapshot, expectedImpact } = value
  return snapshot.projectId === projectId && typeof snapshot.employeeId === 'string' &&
    typeof snapshot.skillId === 'string' && typeof snapshot.weekStart === 'string' &&
    [snapshot.requiredHours, snapshot.supportHours, snapshot.availableHours,
      expectedImpact.hypotheticalSupportHours, expectedImpact.remainingRequiredHours, expectedImpact.remainingAvailableHours]
      .every(hours => typeof hours === 'number' && Number.isFinite(hours) && hours >= 0)
}

const unavailable: DecisionState = { status: 'error', message: 'Chưa xác nhận được quyết định. Thử lại với cùng lựa chọn.' }

function result(http: Response, body: unknown, projectId: string, simulationId: string, decision: DecisionChoice): DecisionState {
  if (http.status === 200 || http.status === 201) {
    return isDecisionRecord(body, projectId) && body.simulationId === simulationId && body.decision === decision
      ? { status: 'saved', record: body } : unavailable
  }
  if (http.status === 401) return { status: 'expired', message: 'Phiên đã hết hạn. Hãy đăng nhập để xem lịch sử.' }
  if (http.status === 403) return { status: 'forbidden', message: 'Bạn không có quyền quyết định cho dự án này.' }
  if (http.status === 400 || http.status === 404) return { status: 'invalid', message: 'Lượt mô phỏng không còn hợp lệ. Hãy mô phỏng lại.' }
  if (http.status === 409 && object(body)) {
    if (body.code === 'STALE_SIMULATION') return { status: 'stale', message: 'Dữ liệu đã thay đổi. Hãy mô phỏng lại.' }
    if (body.code === 'DECISION_CONFLICT') return { status: 'conflict', message: 'Lượt này đã có lựa chọn khác. Hãy xem lịch sử.' }
  }
  return unavailable
}

export class DecisionRequest {
  private current: AbortController | null = null
  private choice: DecisionChoice | null = null
  private settled = false
  private readonly projectId: string
  private readonly evidence: DecisionEvidence
  private readonly send: Send
  private readonly timeoutMs: number

  invalidate() {
    this.current?.abort()
    this.current = null
    this.choice = null
    this.settled = false
  }

  constructor(
    projectId: string, evidence: DecisionEvidence, send: Send = sendDecision, timeoutMs = 10_000,
  ) {
    this.projectId = projectId
    this.evidence = evidence
    this.send = send
    this.timeoutMs = timeoutMs
  }

  retry(publish: (state: DecisionState) => void) {
    if (this.choice) return this.execute(this.choice, publish)
  }

  async execute(decision: DecisionChoice, publish: (state: DecisionState) => void) {
    if (this.current || this.settled || (this.choice && this.choice !== decision)) return
    this.choice = decision
    const request = new AbortController()
    this.current = request
    publish({ status: 'pending' })
    const timeout = setTimeout(() => request.abort(), this.timeoutMs)
    const cancellation = new Promise<never>((_, reject) =>
      request.signal.addEventListener('abort', () => reject(request.signal.reason), { once: true }))
    const readResponse = async () => {
      const response = await this.send(this.projectId, { ...this.evidence, decision }, request.signal)
      const body: unknown = await response.json().catch(() => null)
      return result(response, body, this.projectId, this.evidence.simulationId, decision)
    }
    try {
      const state = await Promise.race([readResponse(), cancellation])
      if (this.current !== request) return
      this.settled = state.status !== 'error'
      publish(state)
    } catch {
      if (this.current === request) publish(unavailable)
    } finally {
      clearTimeout(timeout)
      if (this.current === request) this.current = null
    }
  }
}

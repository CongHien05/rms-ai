import { apiFetch } from '../auth/session.ts'
export type SimulationInput = {
  projectId: string
  employeeId: string
  skillId: string
  weekStart: string
  requiredHours: number
  supportHours: number
  recommendationContext: string
}

export type Impact = {
  hypotheticalSupportHours: number
  remainingRequiredHours: number
  remainingAvailableHours: number
}

export type DecisionEvidence = { simulationId: string; simulationToken: string }

type Failure = { status: 'invalid' | 'missing' | 'error'; message: string }

export type SimulationState =
  | { status: 'idle' | 'loading' | 'stale' }
  | { status: 'success'; impact: Impact; evidence?: DecisionEvidence }
  | Failure

type SendSimulation = (input: SimulationInput, runId: string, signal: AbortSignal) => Promise<Response>

function sendSimulation(input: SimulationInput, runId: string, signal: AbortSignal) {
  const { projectId, ...scenario } = input
  return apiFetch(`/api/projects/${projectId}/simulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ runId, scenario }),
    signal,
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

function isNonNegativeHour(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function readEvidence(body: unknown): DecisionEvidence | undefined {
  if (!isRecord(body) || !isRecord(body.decisionEvidence)) return undefined
  const { simulationId, simulationToken } = body.decisionEvidence
  if (typeof simulationId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(simulationId) ||
    typeof simulationToken !== 'string' || simulationToken.length > 4096 ||
    !/^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(simulationToken)) return undefined
  return { simulationId, simulationToken }
}

function readImpact(body: unknown, input: SimulationInput, runId: string): Impact | null {
  if (!isRecord(body) || body.outcome !== 'available' || body.runId !== runId ||
    typeof body.scenarioReference !== 'string' || !/^[a-f0-9]{64}$/.test(body.scenarioReference) ||
    !isRecord(body.snapshot) || !isRecord(body.expectedImpact)) return null

  const { snapshot, expectedImpact } = body
  for (const key of ['projectId', 'employeeId', 'skillId', 'weekStart', 'requiredHours', 'supportHours'] as const) {
    if (snapshot[key] !== input[key]) return null
  }
  if (!isNonNegativeHour(snapshot.availableHours) || snapshot.availableHours < input.supportHours) return null
  for (const key of ['hypotheticalSupportHours', 'remainingRequiredHours', 'remainingAvailableHours'] as const) {
    if (!isNonNegativeHour(expectedImpact[key])) return null
  }
  if (expectedImpact.hypotheticalSupportHours !== input.supportHours) return null
  return expectedImpact as Impact
}

const unavailable: Failure = { status: 'error', message: 'Chưa thể mô phỏng. Vui lòng thử lại.' }
const simulationTimeoutMs = 10_000

function failureFor(status: number, body: unknown): Failure {
  const message = isRecord(body) && typeof body.message === 'string' ? body.message : undefined
  if (status === 400 || status === 404) {
    return { status: 'invalid', message: message ?? 'Phương án không hợp lệ. Kiểm tra số giờ hoặc tải lại đề xuất.' }
  }
  if (status === 422) {
    return { status: 'missing', message: message ?? 'Chưa có dữ liệu giờ trống cho tuần đã chọn.' }
  }
  return unavailable
}

export function recommendationPresentation(outcome: string | undefined, count: number) {
  if (count > 0) return 'candidates'
  return outcome === 'unavailable' ? 'missing' : 'empty'
}

export class SimulationRun {
  private revision = 0
  private current: { runId: string; revision: number; controller: AbortController } | null = null

  invalidate() {
    this.revision += 1
    this.current?.controller.abort()
    this.current = null
  }

  async execute(
    input: SimulationInput,
    publish: (state: SimulationState) => void,
    send: SendSimulation = sendSimulation,
  ) {
    this.current?.controller.abort()
    const attempt = { runId: crypto.randomUUID(), revision: this.revision, controller: new AbortController() }
    this.current = attempt
    const isCurrent = () => this.current === attempt && this.revision === attempt.revision
    publish({ status: 'loading' })

    const { signal } = attempt.controller
    let timeout: ReturnType<typeof setTimeout> | undefined
    const cancelled = new Promise<never>((_, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true })
      timeout = setTimeout(() => attempt.controller.abort(), simulationTimeoutMs)
    })
    const readResponse = async () => {
      const response = await send(input, attempt.runId, signal)
      const body: unknown = await response.json().catch(() => null)
      return { response, body }
    }

    try {
      const { response, body } = await Promise.race([readResponse(), cancelled])
      if (!isCurrent()) return
      if (!response.ok) {
        publish(failureFor(response.status, body))
        return
      }
      const impact = readImpact(body, input, attempt.runId)
      const evidence = impact ? readEvidence(body) : undefined
      publish(impact ? { status: 'success', impact, ...(evidence ? { evidence } : {}) } : unavailable)
    } catch {
      if (isCurrent()) publish(unavailable)
    } finally {
      clearTimeout(timeout)
      if (isCurrent()) this.current = null
    }
  }
}

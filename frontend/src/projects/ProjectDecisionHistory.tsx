import { useEffect, useState } from 'react'
import { apiFetch } from '../auth/session'
import { formatCalendarDate } from '../layout/formatCalendarDate'
import { isDecisionRecord, type DecisionRecord } from './decisionRequest'

const pageSize = 20
const dateTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
const hours = new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 17 })

type State = { status: 'loading' | 'error' } | {
  status: 'ready'; items: DecisionRecord[]; hasMore: boolean;
}

export function ProjectDecisionHistory({ projectId }: { projectId: string }) {
  const [page, setPage] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const request = new AbortController()
    const timeout = setTimeout(() => {
      request.abort()
      setState({ status: 'error' })
    }, 10_000)
    async function load() {
      try {
        const response = await apiFetch(`/api/projects/${projectId}/decisions?limit=${pageSize}&offset=${page * pageSize}`, {
          signal: request.signal,
        })
        if (!response.ok) throw new Error('Chưa tải được quyết định.')
        const { items, hasMore } = await response.json()
        if (!Array.isArray(items) || !items.every(item => isDecisionRecord(item, projectId)) ||
          typeof hasMore !== 'boolean') throw new Error('Lịch sử không hợp lệ.')
        if (!request.signal.aborted) setState({ status: 'ready', items, hasMore })
      } catch {
        if (!request.signal.aborted) setState({ status: 'error' })
      } finally {
        clearTimeout(timeout)
      }
    }
    void load()
    return () => {
      request.abort()
      clearTimeout(timeout)
    }
  }, [projectId, page, attempt])

  function move(next: number) {
    setState({ status: 'loading' })
    setPage(next)
  }

  return <section className="feedback-panel" aria-label="Lịch sử quyết định">
    <h2>Lịch sử quyết định</h2>
    {state.status === 'loading' && <p role="status">Đang tải quyết định…</p>}
    {state.status === 'error' && <>
      <p role="alert">Chưa tải được lịch sử.</p>
      <button className="button button--secondary" type="button" onClick={() => {
        setState({ status: 'loading' })
        setAttempt(value => value + 1)
      }}>Thử lại lịch sử</button>
    </>}
    {state.status === 'ready' && <>
      {state.items.length === 0
        ? <p className="empty-copy">Chưa có quyết định trên trang này.</p>
        : <ul>{state.items.map(item => <li key={item.id}>
          <details>
            <summary>{item.decision === 'ACCEPT' ? 'Chấp nhận' : 'Từ chối'} · <time dateTime={item.decidedAt}>
              {dateTime.format(new Date(item.decidedAt))}
            </time></summary>
            <dl style={{ overflowWrap: 'anywhere' }}>
              <dt>PM quyết định</dt><dd>{item.pmAccountId}</dd>
              <dt>Lượt mô phỏng</dt><dd>{item.simulationId}</dd>
              <dt>Nhân sự</dt><dd>{item.snapshot.employeeId}</dd>
              <dt>Kỹ năng</dt><dd>{item.snapshot.skillId}</dd>
              <dt>Tuần</dt><dd>{formatCalendarDate(item.snapshot.weekStart)}</dd>
              <dt>Giờ cần và giờ trống tại thời điểm mô phỏng</dt>
              <dd>{hours.format(item.snapshot.requiredHours)} giờ cần · {hours.format(item.snapshot.availableHours)} giờ trống</dd>
              <dt>Giờ hỗ trợ giả định</dt><dd>{hours.format(item.expectedImpact.hypotheticalSupportHours)} giờ</dd>
              <dt>Giờ cần còn thiếu</dt><dd>{hours.format(item.expectedImpact.remainingRequiredHours)} giờ</dd>
              <dt>Giờ trống giả định còn lại</dt><dd>{hours.format(item.expectedImpact.remainingAvailableHours)} giờ</dd>
            </dl>
          </details>
        </li>)}</ul>}
      {(page > 0 || state.hasMore) && <div className="row-actions">
        <button type="button" className="button button--secondary" onClick={() => move(page - 1)} disabled={page === 0}>Trang trước</button>
        <button type="button" className="button button--secondary" onClick={() => move(page + 1)} disabled={!state.hasMore}>Trang sau</button>
      </div>}
    </>}
  </section>
}

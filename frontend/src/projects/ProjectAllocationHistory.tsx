import { useEffect, useState } from 'react'
import { apiFetch } from '../auth/session'
import { displayExactHours } from '../layout/exactHours'
import { isAllocation, type Allocation } from './allocationRequest'

type Entry = {
  id: string; decisionId: string; outcome: 'APPLIED' | 'FAILED'; code: string | null
  occurredAt: string; decidedByAccountId: string; actorAccountId: string; allocation: Allocation | null
}
type Page = { items: Entry[]; hasMore: boolean }
const pageSize = 20
const dateTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' })

function isEntry(value: unknown, projectId: string): value is Entry {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return typeof row.id === 'string' && typeof row.decisionId === 'string' &&
    typeof row.occurredAt === 'string' && Number.isFinite(Date.parse(row.occurredAt)) &&
    typeof row.decidedByAccountId === 'string' && typeof row.actorAccountId === 'string' &&
    (row.outcome === 'APPLIED' && row.code === null && isAllocation(row.allocation, projectId, row.decisionId) ||
      row.outcome === 'FAILED' && typeof row.code === 'string' && row.allocation === null)
}

export function ProjectAllocationHistory({ projectId }: { projectId: string }) {
  const [offset, setOffset] = useState(0)
  const [revision, setRevision] = useState(0)
  const [page, setPage] = useState<Page | 'error' | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => { controller.abort(); setPage('error') }, 10_000)
    async function load() {
      try {
        const response = await apiFetch(`/api/projects/${projectId}/allocation-results?limit=${pageSize}&offset=${offset}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Không tải được lịch sử áp dụng.')
        const data = await response.json()
        if (!Array.isArray(data?.items) || !data.items.every((item: unknown) => isEntry(item, projectId)) ||
          typeof data.hasMore !== 'boolean') throw new Error('Lịch sử áp dụng không hợp lệ.')
        if (!controller.signal.aborted) setPage(data)
      } catch {
        if (!controller.signal.aborted) setPage('error')
      } finally {
        clearTimeout(timer)
      }
    }
    void load()
    return () => { controller.abort(); clearTimeout(timer) }
  }, [projectId, offset, revision])

  return <section className="feedback-panel" aria-label="Lịch sử áp dụng">
    <h2>Lịch sử áp dụng</h2>
    {!page && <p role="status">Đang tải lịch sử áp dụng…</p>}
    {page === 'error' && <>
      <p role="alert">Không tải được lịch sử áp dụng.</p>
      <button type="button" className="button button--secondary" onClick={() => {
        setPage(null)
        setRevision(value => value + 1)
      }}>Thử lại</button>
    </>}
    {page && page !== 'error' && <>
      {page.items.length === 0 && <p>Chưa có kết quả áp dụng trên trang này.</p>}
      <ul>{page.items.map(item => <li key={item.id} style={{ overflowWrap: 'anywhere' }}>
        <details>
          <summary>{item.allocation ? `Đã áp dụng ${displayExactHours(item.allocation.hoursExact)} giờ` : 'Áp dụng thất bại'} · {dateTime.format(new Date(item.occurredAt))}</summary>
          <p>Quyết định {item.decisionId}</p>
          <p>PM quyết định {item.decidedByAccountId}</p>
          <p>PM thực hiện {item.actorAccountId}</p>
          {item.code && <p>Mã lỗi {item.code}</p>}
        </details>
      </li>)}</ul>
      {(offset > 0 || page.hasMore) && <>
        <button type="button" className="button button--secondary" disabled={offset === 0}
          onClick={() => { setPage(null); setOffset(value => value - pageSize) }}>Trang trước</button>
        <button type="button" className="button button--secondary" disabled={!page.hasMore}
          onClick={() => { setPage(null); setOffset(value => value + pageSize) }}>Trang sau</button>
      </>}
    </>}
  </section>
}

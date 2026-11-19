import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useHrData } from '../hr-workspace/useHrData'
import { formatCalendarDate } from '../layout/formatCalendarDate'
import { Pagination } from '../layout/Pagination'
import { usePagination } from '../layout/usePagination'

type Skill = { id: string; name: string }
type Criteria = { skillId: string; weekStart: string; hours: string }
type Recommendation = {
  skill: Skill
  weekStart: string
  requiredHours: number
  candidates: { employeeId: string; displayName: string; availableHours: number; supportHours: number }[]
}

type Result =
  | { status: 'idle' | 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: Recommendation }

const hoursFormat = new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 15 })
const vietnamDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function currentWeekStart() {
  const parts = vietnamDateFormat.formatToParts(new Date())
  const part = (type: string) => parts.find(item => item.type === type)?.value
  const monday = new Date(`${part('year')}-${part('month')}-${part('day')}T00:00:00Z`)
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7))
  return monday.toISOString().slice(0, 10)
}

export const resourceRecommendationsPanelId = 'project-resource-recommendations'

export function ProjectResourceRecommendations({ projectId }: { projectId: string }) {
  const { state: skills, retry: retrySkills } = useHrData<Skill[]>('/api/skills')
  const [criteria, setCriteria] = useState<Criteria>(() => ({
    skillId: '',
    weekStart: currentWeekStart(),
    hours: '',
  }))
  const [fieldError, setFieldError] = useState('')
  const [result, setResult] = useState<Result>({ status: 'idle' })
  const active = useRef<AbortController | null>(null)
  const data = result.status === 'ready' ? result.data : null
  const { items, page, pageCount, setPage } = usePagination(data?.candidates ?? [], 8)

  useEffect(() => () => active.current?.abort(), [])

  function updateCriteria(key: keyof Criteria, value: string) {
    active.current?.abort()
    active.current = null
    setCriteria(previous => ({ ...previous, [key]: value }))
    setResult({ status: 'idle' })
    setFieldError('')
  }

  async function search() {
    if (active.current) return
    setResult({ status: 'idle' })
    setFieldError('')
    const { skillId, weekStart } = criteria
    const requiredHours = Number(criteria.hours)
    if (!skillId) {
      setFieldError('Hãy chọn kỹ năng cần hỗ trợ.')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart) || new Date(`${weekStart}T00:00:00Z`).getUTCDay() !== 1) {
      setFieldError('Hãy chọn ngày thứ Hai bắt đầu tuần.')
      return
    }
    if (!Number.isFinite(requiredHours) || requiredHours <= 0) {
      setFieldError('Số giờ cần hỗ trợ phải lớn hơn 0 và hữu hạn.')
      return
    }

    const request = new AbortController()
    active.current = request
    setPage(1)
    setResult({ status: 'loading' })
    try {
      const response = await fetch(`/api/projects/${projectId}/resource-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, weekStart, requiredHours }),
        signal: request.signal,
      })
      if (!response.ok) {
        if (response.status === 404 && !request.signal.aborted) {
          setResult({ status: 'error', message: 'Dự án hoặc kỹ năng đã chọn không còn khả dụng.' })
          return
        }
        throw new Error('Resource recommendation request failed.')
      }
      const recommendation: Recommendation = await response.json()
      if (!request.signal.aborted) setResult({ status: 'ready', data: recommendation })
    } catch {
      if (!request.signal.aborted) setResult({ status: 'error', message: 'Không tải được đề xuất nhân sự.' })
    } finally {
      if (active.current === request) active.current = null
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void search()
  }

  return (
    <section className="panel project-recommendations" id={resourceRecommendationsPanelId}
      aria-labelledby="project-recommendations-title">
      <div className="section-heading">
        <h2 id="project-recommendations-title">Đề xuất nhân sự</h2>
        <span className="scope-note">Quy tắc minh họa</span>
      </div>
      <p className="muted">Tìm người có kỹ năng và giờ trống trong tuần. Mỗi người là một phương án riêng.</p>

      {skills.status === 'loading' && <p role="status">Đang tải kỹ năng…</p>}
      {skills.status === 'error' && (
        <div className="feedback-panel feedback-panel--error">
          <p role="alert">Không tải được danh mục kỹ năng.</p>
          <button type="button" className="button button--secondary" onClick={retrySkills}>Thử lại</button>
        </div>
      )}
      {skills.status === 'ready' && skills.data.length === 0 && (
        <p role="status">Chưa có kỹ năng để chọn.</p>
      )}
      {skills.status === 'ready' && skills.data.length > 0 && (
        <form className="project-recommendations__form" onSubmit={handleSubmit} noValidate>
          <label>
            Kỹ năng
            <select required value={criteria.skillId} onChange={event => updateCriteria('skillId', event.target.value)}>
              <option value="">Chọn kỹ năng</option>
              {skills.data.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
            </select>
          </label>
          <label>
            Tuần bắt đầu (thứ Hai)
            <input type="date" required value={criteria.weekStart}
              onChange={event => updateCriteria('weekStart', event.target.value)} />
          </label>
          <label>
            Số giờ cần hỗ trợ
            <input type="number" required min="0" step="any" value={criteria.hours}
              onChange={event => updateCriteria('hours', event.target.value)} />
          </label>
          <button type="submit" className="button button--primary" disabled={result.status === 'loading'}>
            Xem đề xuất
          </button>
        </form>
      )}
      {fieldError && <p className="field-error" role="alert">{fieldError}</p>}
      {result.status === 'loading' && <p role="status">Đang tìm người có thể hỗ trợ…</p>}
      {result.status === 'error' && (
        <div className="feedback-panel feedback-panel--error">
          <p role="alert">{result.message}</p>
          <button type="button" className="button button--secondary" onClick={() => void search()}>Thử lại</button>
        </div>
      )}
      {data && (
        data.candidates.length === 0 ? (
          <p className="feedback-panel" role="status">Không có ứng viên phù hợp với tiêu chí đã chọn.</p>
        ) : (
          <div>
            <p className="muted" role="status">
              {data.candidates.length} người có thể hỗ trợ · Tuần {formatCalendarDate(data.weekStart)} · Chỉ xem
            </p>
            <ol className="data-panel data-list" aria-label="Người có thể hỗ trợ">
              {items.map(candidate => (
                <li key={candidate.employeeId}>
                  <strong>{candidate.displayName}</strong>
                  <p className="muted">
                    {data.skill.name} · còn {hoursFormat.format(candidate.availableHours)} giờ
                    {' · đáp ứng '}{hoursFormat.format(candidate.supportHours)}/{hoursFormat.format(data.requiredHours)} giờ
                  </p>
                </li>
              ))}
            </ol>
            <Pagination label="Phân trang người hỗ trợ" page={page} pageCount={pageCount} setPage={setPage} />
          </div>
        )
      )}
    </section>
  )
}

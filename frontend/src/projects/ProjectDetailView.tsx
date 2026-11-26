import { apiFetch } from '../auth/session.ts'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import './project-detail.css'
import { formatCalendarDate } from '../layout/formatCalendarDate'
import { Pagination } from '../layout/Pagination'
import { usePagination } from '../layout/usePagination'
import { TaskLoadGuard } from './taskLoadGuard'
import { ProjectResourceRecommendations, resourceRecommendationsPanelId } from './ProjectResourceRecommendations'
import { ProjectDecisionHistory } from './ProjectDecisionHistory'
import { ProjectRiskAssessment } from './ProjectRiskAssessment'
import {
  applyConfirmedTaskUpdate,
  buildTaskPlanningPayload,
  type TaskPlanningPayload,
} from './taskPlanning'
import {
  summarizeTaskProgress,
  type TaskProgress,
  type TaskStatus,
} from './taskProgress'

type Sprint = { id: string; projectId: string; name: string }

const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'Chưa làm' },
  { value: 'IN_PROGRESS', label: 'Đang làm' },
  { value: 'BLOCKED', label: 'Bị chặn' },
  { value: 'DONE', label: 'Hoàn thành' },
]

type Task = {
  id: string
  sprintId: string
  title: string
  status: TaskStatus
  dueDate: string | null
  estimatedHours: number | null
}

const PAGE_SIZE = 10
const taskHoursFormat = new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 15 })

// ── Cột phải: Công việc của đúng một Sprint đang chọn ─────────────────────────

interface SprintWorkspaceProps {
  readonly sprint: Sprint
}

function SelectedSprintWorkspace({ sprint }: SprintWorkspaceProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editDueDate, setEditDueDate] = useState('')
  const [editEstimatedHours, setEditEstimatedHours] = useState('')
  const [updatingTaskIds, setUpdatingTaskIds] = useState<Record<string, boolean>>({})
  const [taskErrors, setTaskErrors] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)

  const submitting = useRef(false)
  const updatingTasksRef = useRef<Set<string>>(new Set())
  const loadGuardRef = useRef(new TaskLoadGuard())
  const request = useRef<AbortController | null>(null)

  const isAnyTaskUpdating = Object.keys(updatingTaskIds).length > 0
  const progress: TaskProgress = summarizeTaskProgress(tasks)

  const load = useCallback(async () => {
    const loadRevision = loadGuardRef.current.beginLoad()
    if (loadRevision === null) return

    request.current?.abort()
    const ctrl = new AbortController()
    request.current = ctrl
    setLoading(true)
    setLoadError('')
    try {
      const res = await apiFetch(`/api/sprints/${sprint.id}/tasks`, { signal: ctrl.signal })
      if (!res.ok) throw new Error('load')
      const data: Task[] = await res.json()
      if (
        !ctrl.signal.aborted
        && loadGuardRef.current.canApplyLoad(loadRevision)
      ) {
        setTasks(data.map(item => ({
          ...item,
          status: item.status || 'TODO',
          dueDate: item.dueDate ?? null,
          estimatedHours: item.estimatedHours ?? null,
        })))
        setEditingTaskId(null)
        setCurrentPage(1)
      }
    } catch {
      if (!ctrl.signal.aborted) setLoadError('Không tải được danh sách công việc.')
    } finally {
      if (request.current === ctrl) {
        request.current = null
        setLoading(false)
      }
    }
  }, [sprint.id])

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    void load()
    return () => request.current?.abort()
  }, [load])

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting.current || loading || updatingTasksRef.current.size > 0) return
    if (!title.trim()) { setFormError('Tên công việc không được để trống.'); return }
    let planning: TaskPlanningPayload
    try {
      planning = buildTaskPlanningPayload(dueDate, estimatedHours)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Thông tin công việc không hợp lệ.')
      return
    }
    submitting.current = true
    setSaving(true)
    setFormError('')
    try {
      const res = await apiFetch(`/api/sprints/${sprint.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), ...planning }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg: string = Array.isArray(err?.message)
          ? (err.message as string[]).join('; ')
          : (typeof err?.message === 'string' ? err.message : 'Tạo công việc thất bại.')
        setFormError(msg)
        return
      }
      const created: Task = await res.json()
      setTasks(prev => [...prev, {
        ...created,
        status: created.status || 'TODO',
        dueDate: created.dueDate ?? null,
        estimatedHours: created.estimatedHours ?? null,
      }])
      setTitle('')
      setDueDate('')
      setEstimatedHours('')
      setShowCreateTask(false)
    } catch {
      setFormError('Chưa xác nhận kết quả. Tải lại trước khi thử lại.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  async function patchTask(
    taskId: string,
    payload: Partial<Pick<Task, 'status' | 'dueDate' | 'estimatedHours'>>,
    fallbackError: string,
  ): Promise<Task | null> {
    if (submitting.current || updatingTasksRef.current.has(taskId)) return null
    loadGuardRef.current.beginUpdate()
    request.current?.abort()
    request.current = null
    setLoading(false)

    updatingTasksRef.current.add(taskId)
    setUpdatingTaskIds(prev => ({ ...prev, [taskId]: true }))
    setTaskErrors(prev => {
      const next = { ...prev }
      delete next[taskId]
      return next
    })

    try {
      const res = await apiFetch(`/api/sprints/${sprint.id}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = Array.isArray(err?.message)
          ? err.message.join('; ')
          : (typeof err?.message === 'string' ? err.message : fallbackError)
        throw new Error(msg)
      }
      const updated: Task = await res.json()
      setTasks(prev => applyConfirmedTaskUpdate(prev, {
        ...updated,
        status: updated.status || 'TODO',
        dueDate: updated.dueDate ?? null,
        estimatedHours: updated.estimatedHours ?? null,
      }))
      return updated
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : fallbackError
      setTaskErrors(prev => ({ ...prev, [taskId]: message }))
      return null
    } finally {
      loadGuardRef.current.finishUpdate()
      updatingTasksRef.current.delete(taskId)
      setUpdatingTaskIds(prev => {
        const next = { ...prev }
        delete next[taskId]
        return next
      })
    }
  }

  function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    void patchTask(taskId, { status: newStatus }, 'Cập nhật trạng thái thất bại. Đã giữ trạng thái cũ.')
  }

  function beginPlanningEdit(task: Task) {
    if (saving || updatingTasksRef.current.size > 0) return
    setEditingTaskId(task.id)
    setEditDueDate(task.dueDate ?? '')
    setEditEstimatedHours(task.estimatedHours?.toString() ?? '')
    setTaskErrors(prev => {
      const next = { ...prev }
      delete next[task.id]
      return next
    })
  }

  async function updatePlanning(e: FormEvent<HTMLFormElement>, taskId: string) {
    e.preventDefault()
    let planning: TaskPlanningPayload
    try {
      planning = buildTaskPlanningPayload(editDueDate, editEstimatedHours)
    } catch (error) {
      setTaskErrors(prev => ({
        ...prev,
        [taskId]: error instanceof Error ? error.message : 'Thông tin công việc không hợp lệ.',
      }))
      return
    }

    const updated = await patchTask(
      taskId,
      planning,
      'Cập nhật hạn và số giờ ước tính thất bại. Đã giữ dữ liệu cũ.',
    )
    if (updated) setEditingTaskId(current => current === taskId ? null : current)
  }

  // Phân trang 10 dòng
  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const displayedTasks = tasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="sprint-workspace-card" data-sprint-id={sprint.id}>
      {/* Tiêu đề Sprint đang chọn có tiến độ và nút Thêm Task */}
      <div className="sprint-workspace-header">
        <div className="sprint-workspace-header__title-group">
          <h2 className="sprint-workspace-title">{sprint.name}</h2>

          {/* Tiến độ Sprint: Không hiển thị 0% khi Task còn đang tải */}
          <div className="sprint-progress-indicator">
            {loading ? (
              <span className="sprint-progress-text sprint-progress-text--loading">Đang tải công việc…</span>
            ) : tasks.length === 0 ? (
              <span className="sprint-progress-text sprint-progress-text--empty">Chưa có công việc</span>
            ) : (
              <div className="sprint-progress-detail">
                <span className="sprint-progress-rate">
                  {progress.completed}/{progress.total} hoàn thành ({progress.completionRate}%)
                </span>
                {progress.blocked > 0 && (
                  <span className="sprint-blocked-tag">
                    {progress.blocked} bị chặn
                  </span>
                )}
                <span
                  className="sprint-progress-bar"
                  role="progressbar"
                  aria-label={`Tiến độ hoàn thành: ${progress.completionRate}%`}
                  aria-valuenow={progress.completionRate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span
                    className="sprint-progress-fill"
                    style={{ width: `${progress.completionRate}%` }}
                  />
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="sprint-workspace-header__actions">
          <button
            type="button"
            className="button button--secondary button--sm"
            onClick={() => void load()}
            disabled={loading || saving || isAnyTaskUpdating}
            title="Tải lại danh sách công việc"
          >
            Tải lại
          </button>
          <button
            type="button"
            className="button button--primary button--sm"
            aria-expanded={showCreateTask}
            onClick={() => setShowCreateTask(show => !show)}
            disabled={saving || loading || isAnyTaskUpdating}
          >
            {showCreateTask ? 'Đóng biểu mẫu' : 'Tạo công việc'}
          </button>
        </div>
      </div>

      {/* Form thêm Task chỉ mở khi bấm */}
      {showCreateTask && (
        <form className="task-inline-create" onSubmit={create} noValidate>
          <div className="task-form-row">
            <div className="task-form-field task-form-field--title">
              <label htmlFor={`task-title-${sprint.id}`}>Tên công việc</label>
              <input
                id={`task-title-${sprint.id}`}
                placeholder="Nhập tên công việc…"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={saving || isAnyTaskUpdating}
                aria-invalid={!!formError}
                aria-describedby={formError ? `task-err-${sprint.id}` : undefined}
                autoFocus
              />
            </div>
            <div className="task-form-field">
              <label htmlFor={`task-due-date-${sprint.id}`}>Hạn hoàn thành</label>
              <input
                id={`task-due-date-${sprint.id}`}
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                disabled={saving || isAnyTaskUpdating}
              />
            </div>
            <div className="task-form-field">
              <label htmlFor={`task-estimated-hours-${sprint.id}`}>Giờ ước tính</label>
              <input
                id={`task-estimated-hours-${sprint.id}`}
                type="number"
                min="0"
                step="any"
                placeholder="Ví dụ: 3.5"
                value={estimatedHours}
                onChange={e => setEstimatedHours(e.target.value)}
                disabled={saving || isAnyTaskUpdating}
              />
            </div>
          </div>
          <div className="task-create-actions">
            <button
              className="button button--primary button--sm"
              disabled={saving || loading || isAnyTaskUpdating}
              type="submit"
            >
              {saving ? 'Đang tạo…' : 'Tạo công việc'}
            </button>
            <button
              className="button button--secondary button--sm"
              type="button"
              onClick={() => {
                setShowCreateTask(false)
                setFormError('')
              }}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
          {formError && (
            <p id={`task-err-${sprint.id}`} role="alert" className="field-error">
              {formError}
            </p>
          )}
        </form>
      )}

      {/* Thông báo tải / lỗi */}
      {loading && (
        <p role="status" className="status-text task-status-notice">
          Đang tải công việc…
        </p>
      )}

      {!loading && loadError && (
        <div role="alert" className="task-error-box">
          <p className="field-error">{loadError}</p>
          <button className="button button--secondary button--sm" type="button" onClick={() => void load()}>
            Thử lại
          </button>
        </div>
      )}

      {!loading && !loadError && tasks.length === 0 && (
        <div className="task-empty-box">
          <p className="empty-hint">Sprint này chưa có công việc.</p>
        </div>
      )}

      {/* Task hiển thị thành bảng gọn: tên, trạng thái, hạn, giờ ước tính, thao tác */}
      {!loading && !loadError && tasks.length > 0 && (
        <div className="task-table-wrapper">
          {/* Desktop Table View */}
          <table className="table task-table" aria-label={`Danh sách công việc của ${sprint.name}`}>
            <thead>
              <tr role="row">
                <th scope="col" className="task-th task-th--title">Tên công việc</th>
                <th scope="col" className="task-th task-th--status">Trạng thái</th>
                <th scope="col" className="task-th task-th--date">Hạn</th>
                <th scope="col" className="task-th task-th--hours">Ước tính</th>
                <th scope="col" className="task-th task-th--actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {displayedTasks.map(task => {
                const isUpdating = !!updatingTaskIds[task.id]
                const error = taskErrors[task.id]
                const isBlocked = task.status === 'BLOCKED'
                const isEditing = editingTaskId === task.id

                return (
                  <tr
                    key={task.id}
                    role="row"
                    data-task-id={task.id}
                    data-status={task.status}
                    className={`task-tr ${isBlocked ? 'task-tr--blocked' : ''}`}
                  >
                    {/* Cột 1: Tên Task (ưu tiên chiều rộng) */}
                    <td className="task-td task-td--title">
                      <span className="task-name">{task.title}</span>
                      {isEditing && (
                        <form
                          className="task-edit-subform"
                          onSubmit={e => void updatePlanning(e, task.id)}
                          noValidate
                        >
                          <div className="task-edit-fields">
                            <div className="task-form-field">
                              <label htmlFor={`edit-due-${task.id}`}>Hạn hoàn thành</label>
                              <input
                                id={`edit-due-${task.id}`}
                                type="date"
                                value={editDueDate}
                                onChange={e => setEditDueDate(e.target.value)}
                                disabled={isUpdating}
                              />
                            </div>
                            <div className="task-form-field">
                              <label htmlFor={`edit-hours-${task.id}`}>Số giờ ước tính</label>
                              <input
                                id={`edit-hours-${task.id}`}
                                type="number"
                                min="0"
                                step="any"
                                placeholder="Để trống để xóa"
                                value={editEstimatedHours}
                                onChange={e => setEditEstimatedHours(e.target.value)}
                                disabled={isUpdating}
                              />
                            </div>
                            <div className="task-edit-btns">
                              <button
                                className="button button--primary button--sm"
                                type="submit"
                                disabled={isUpdating}
                              >
                                {isUpdating ? 'Lưu…' : 'Lưu'}
                              </button>
                              <button
                                className="button button--secondary button--sm"
                                type="button"
                                onClick={() => setEditingTaskId(null)}
                                disabled={isUpdating}
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                      {error && <p role="alert" className="field-error task-row-error">{error}</p>}
                    </td>

                    {/* Cột 2: Trạng thái */}
                    <td className="task-td task-td--status">
                      <div className="task-status-wrap">
                        <label htmlFor={`task-status-${task.id}`} className="sr-only">
                          Trạng thái công việc {task.title}
                        </label>
                        <select
                          id={`task-status-${task.id}`}
                          className={`task-status-select task-status-select--${task.status.toLowerCase()}`}
                          value={task.status}
                          disabled={saving || isUpdating}
                          aria-busy={isUpdating}
                          onChange={e =>
                            void handleStatusChange(
                              task.id,
                              e.target.value as TaskStatus,
                            )
                          }
                        >
                          {TASK_STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {isUpdating && <span className="status-saving-hint">Lưu…</span>}
                      </div>
                    </td>

                    {/* Cột 3: Hạn */}
                    <td className="task-td task-td--date">
                      {task.dueDate
                        ? <time dateTime={task.dueDate}>{formatCalendarDate(task.dueDate)}</time>
                        : <span className="task-empty-val">Chưa đặt</span>}
                    </td>

                    {/* Cột 4: Giờ ước tính */}
                    <td className="task-td task-td--hours">
                      <span className={task.estimatedHours !== null ? 'task-hours-val' : 'task-empty-val'}>
                        {task.estimatedHours !== null ? `${taskHoursFormat.format(task.estimatedHours)} giờ` : '—'}
                      </span>
                    </td>

                    {/* Cột 5: Thao tác */}
                    <td className="task-td task-td--actions">
                      <button
                        className="button button--secondary button--sm task-edit-btn"
                        type="button"
                        onClick={() => {
                          if (isEditing) setEditingTaskId(null)
                          else beginPlanningEdit(task)
                        }}
                        disabled={saving || isAnyTaskUpdating}
                        aria-expanded={isEditing}
                      >
                        {isEditing ? 'Đóng' : 'Sửa'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Mobile View: Mỗi Task thành một hàng hai dòng, không tràn ngang */}
          <div className="task-mobile-list" role="list">
            {displayedTasks.map(task => {
              const isUpdating = !!updatingTaskIds[task.id]
              const error = taskErrors[task.id]
              const isEditing = editingTaskId === task.id

              return (
                <div
                  key={task.id}
                  className="task-mobile-card"
                  role="listitem"
                  data-task-id={task.id}
                  data-status={task.status}
                >
                  {/* Dòng 1: Tên Task + Trạng thái */}
                  <div className="task-mobile-row1">
                    <span className="task-name">{task.title}</span>
                    <label htmlFor={`m-task-status-${task.id}`} className="visually-hidden">
                      Trạng thái công việc {task.title}
                    </label>
                    <select
                      id={`m-task-status-${task.id}`}
                      className={`task-status-select task-status-select--${task.status.toLowerCase()}`}
                      value={task.status}
                      disabled={saving || isUpdating}
                      aria-busy={isUpdating}
                      onChange={e =>
                        void handleStatusChange(
                          task.id,
                          e.target.value as TaskStatus,
                        )
                      }
                    >
                      {TASK_STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dòng 2: Hạn hoàn thành + Giờ ước tính + Nút Sửa */}
                  <div className="task-mobile-row2">
                    <div className="task-mobile-meta">
                      <span>Hạn: {task.dueDate
                        ? <time dateTime={task.dueDate}>{formatCalendarDate(task.dueDate)}</time>
                        : 'Chưa đặt'}</span>
                      <span>·</span>
                      <span>{task.estimatedHours !== null ? `${taskHoursFormat.format(task.estimatedHours)} giờ` : 'Chưa ước tính'}</span>
                    </div>
                    <button
                      className="button button--secondary button--sm task-edit-btn"
                      type="button"
                      aria-expanded={isEditing}
                      onClick={() => {
                        if (isEditing) setEditingTaskId(null)
                        else beginPlanningEdit(task)
                      }}
                      disabled={saving || isAnyTaskUpdating}
                    >
                      {isEditing ? 'Đóng' : 'Sửa'}
                    </button>
                  </div>

                  {/* Form sửa inline trên mobile */}
                  {isEditing && (
                    <form
                      className="task-edit-subform task-edit-subform--mobile"
                      onSubmit={e => void updatePlanning(e, task.id)}
                      noValidate
                    >
                      <div className="task-form-field">
                        <label htmlFor={`m-edit-due-${task.id}`}>Hạn hoàn thành</label>
                        <input
                          id={`m-edit-due-${task.id}`}
                          type="date"
                          value={editDueDate}
                          onChange={e => setEditDueDate(e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="task-form-field">
                        <label htmlFor={`m-edit-hours-${task.id}`}>Số giờ ước tính</label>
                        <input
                          id={`m-edit-hours-${task.id}`}
                          type="number"
                          min="0"
                          step="any"
                          placeholder="Để trống để xóa"
                          value={editEstimatedHours}
                          onChange={e => setEditEstimatedHours(e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="task-edit-btns">
                        <button
                          className="button button--primary button--sm"
                          type="submit"
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Lưu…' : 'Lưu'}
                        </button>
                        <button
                          className="button button--secondary button--sm"
                          type="button"
                          onClick={() => setEditingTaskId(null)}
                          disabled={isUpdating}
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  )}

                  {error && <p role="alert" className="field-error task-row-error">{error}</p>}
                </div>
              )
            })}
          </div>

          <Pagination label="Phân trang công việc" page={currentPage}
            pageCount={totalPages} setPage={setCurrentPage} />
        </div>
      )}
    </div>
  )
}

// ── Main view: PM Chi tiết dự án ─────────────────────────────────────────────

type Project = { id: string; name: string }

interface Props {
  readonly projectId: string
  readonly onBack: () => void
}

export function ProjectDetailView({ projectId, onBack }: Props) {
  const [project, setProject] = useState<Project | null>(null)
  const [projectError, setProjectError] = useState('')
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [historyProject, setHistoryProject] = useState<string | null>(null)
  const [historyRevision, setHistoryRevision] = useState(0)
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [sprintName, setSprintName] = useState('')
  const [savingSprint, setSavingSprint] = useState(false)
  const [sprintFormError, setSprintFormError] = useState('')
  const [showCreateSprint, setShowCreateSprint] = useState(false)
  const [sprintNotice, setSprintNotice] = useState('')
  const sprintPageSize = 6
  const sprintPage = usePagination(sprints, sprintPageSize)

  const submitting = useRef(false)
  const request = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    request.current?.abort()
    const ctrl = new AbortController()
    request.current = ctrl
    setLoading(true)
    setLoadError('')
    setProjectError('')
    try {
      const [projRes, sprintRes] = await Promise.all([
        apiFetch(`/api/projects/${projectId}`, { signal: ctrl.signal }),
        apiFetch(`/api/projects/${projectId}/sprints`, { signal: ctrl.signal }),
      ])
      if (!projRes.ok) {
        if (projRes.status === 404) {
          if (!ctrl.signal.aborted) setProjectError('Không tìm thấy dự án.')
          return
        }
        throw new Error('project')
      }
      if (!sprintRes.ok) throw new Error('sprints')
      const [proj, sprintData]: [Project, Sprint[]] = await Promise.all([
        projRes.json() as Promise<Project>,
        sprintRes.json() as Promise<Sprint[]>,
      ])
      if (!ctrl.signal.aborted) {
        setProject(proj)
        setSprints(sprintData)
        setSelectedSprintId(current => {
          if (current && sprintData.some(s => s.id === current)) return current
          return sprintData[0]?.id ?? null
        })
      }
    } catch {
      if (!ctrl.signal.aborted) setLoadError('Không tải được dữ liệu. Vui lòng thử lại.')
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    void load()
    return () => request.current?.abort()
  }, [load])

  async function createSprint(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting.current) return
    setSprintNotice('')
    if (!sprintName.trim()) { setSprintFormError('Tên Sprint không được để trống.'); return }
    submitting.current = true
    setSavingSprint(true)
    setSprintFormError('')
    try {
      const res = await apiFetch(`/api/projects/${projectId}/sprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sprintName.trim() }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg: string = Array.isArray(err?.message)
          ? (err.message as string[]).join('; ')
          : (typeof err?.message === 'string' ? err.message : 'Không tạo được Sprint.')
        setSprintFormError(msg)
        return
      }
      const newSprint: Sprint = await res.json()
      setSprintName('')
      setShowCreateSprint(false)
      setSprints(prev => [...prev, newSprint])
      setSelectedSprintId(newSprint.id)
      sprintPage.setPage(Math.ceil((sprints.length + 1) / sprintPageSize))
      setSprintNotice(`Đã tạo Sprint ${newSprint.name}.`)
    } catch {
      setSprintFormError('Chưa xác nhận kết quả. Tải lại danh sách trước khi thử lại.')
    } finally {
      submitting.current = false
      setSavingSprint(false)
    }
  }

  if (projectError) {
    return (
      <section aria-label="Chi tiết dự án">
        <button className="back-button" type="button" onClick={onBack}>Danh sách dự án</button>
        <p role="alert" className="feedback-panel feedback-panel--error">{projectError}</p>
      </section>
    )
  }

  const selectedSprint = sprints.find(s => s.id === selectedSprintId) ?? sprints[0] ?? null

  function cancelCreateSprint() {
    setShowCreateSprint(false)
    setSprintFormError('')
  }

  return (
    <section className="project-detail" aria-labelledby="project-detail-title">
      <button className="back-button" type="button" onClick={onBack}>Danh sách dự án</button>
      <header className="page-heading project-detail-topbar">
        <h1 id="project-detail-title">
          {project?.id === projectId ? project.name : (loading ? 'Đang tải…' : 'Dự án')}
        </h1>
        {project?.id === projectId && (
          <div className="action-group project-detail-actions">
            <button className="button button--secondary" type="button" aria-expanded={showRecommendations}
              aria-controls={showRecommendations ? resourceRecommendationsPanelId : undefined}
              onClick={() => setShowRecommendations(open => !open)}>
              Đề xuất nhân sự
            </button>
            <ProjectRiskAssessment key={projectId} projectId={projectId} />
          </div>
        )}
      </header>

      {showRecommendations && project?.id === projectId && (
        <ProjectResourceRecommendations key={projectId} projectId={projectId}
          onDecisionSaved={() => setHistoryRevision(value => value + 1)}
          onShowHistory={() => {
            setHistoryProject(projectId)
            setHistoryRevision(value => value + 1)
          }} />
      )}
      {project?.id === projectId && <>
        <button type="button" className="button button--secondary" aria-expanded={historyProject === projectId}
          onClick={() => setHistoryProject(value => value === projectId ? null : projectId)}>
          {historyProject === projectId ? 'Ẩn lịch sử quyết định' : 'Xem lịch sử quyết định'}
        </button>
        {historyProject === projectId && <ProjectDecisionHistory key={`${projectId}:${historyRevision}`} projectId={projectId} />}
      </>}
      {sprintNotice && <p role="status" className="feedback-panel feedback-panel--success">{sprintNotice}</p>}
      {loading && <p role="status" className="feedback-panel">Đang tải dữ liệu dự án…</p>}
      {!loading && loadError && (
        <div className="feedback-panel feedback-panel--error">
          <p role="alert">{loadError}</p>
          <button className="button button--secondary" type="button" onClick={() => void load()}>Thử lại</button>
        </div>
      )}

      {!loading && !loadError && (
        <div className="project-detail-body">
          <aside className="sprint-sidebar data-panel" aria-label="Danh sách Sprint">
            <div className="sprint-sidebar__header">
              <h2>Sprint <span className="muted">({sprints.length})</span></h2>
              <button className="button button--secondary button--sm" type="button"
                aria-expanded={showCreateSprint} disabled={showCreateSprint}
                onClick={() => setShowCreateSprint(true)}>
                Tạo Sprint
              </button>
            </div>

            {showCreateSprint && (
              <form className="sprint-add-form" onSubmit={createSprint} noValidate>
                <label htmlFor="sprint-name-input">Tên Sprint</label>
                <input id="sprint-name-input" value={sprintName} onChange={e => setSprintName(e.target.value)}
                  disabled={savingSprint} required autoFocus
                  aria-invalid={!!sprintFormError} aria-describedby={sprintFormError ? 'sprint-form-error' : undefined} />
                <div className="action-group">
                  <button className="button button--primary button--sm" type="submit" disabled={savingSprint}>
                    {savingSprint ? 'Đang tạo…' : 'Tạo Sprint'}
                  </button>
                  <button className="button button--secondary button--sm" type="button"
                    onClick={cancelCreateSprint} disabled={savingSprint}>Hủy</button>
                </div>
                {sprintFormError && <p role="alert" className="field-error" id="sprint-form-error">{sprintFormError}</p>}
              </form>
            )}

            {selectedSprint && (
              <>
                <div className="mobile-sprint-bar">
                  <label htmlFor="mobile-sprint-select" className="visually-hidden">Chọn Sprint</label>
                  <select id="mobile-sprint-select" value={selectedSprint.id}
                    onChange={e => setSelectedSprintId(e.target.value)}>
                    {sprints.map(sprint => <option key={sprint.id} value={sprint.id}>{sprint.name}</option>)}
                  </select>
                </div>
                <div className="sprint-sidebar__list">
                  {sprintPage.items.map(sprint => {
                    const isSelected = selectedSprint.id === sprint.id
                    return (
                      <button key={sprint.id} type="button" aria-pressed={isSelected}
                        className="sprint-sidebar__item" onClick={() => setSelectedSprintId(sprint.id)}>
                        {sprint.name}
                      </button>
                    )
                  })}
                  <Pagination label="Phân trang Sprint" page={sprintPage.page}
                    pageCount={sprintPage.pageCount} setPage={sprintPage.setPage} />
                </div>
              </>
            )}
          </aside>

          <div className="sprint-main-area">
            {selectedSprint ? (
              <SelectedSprintWorkspace key={selectedSprint.id} sprint={selectedSprint} />
            ) : (
              <p className="feedback-panel" role="status">Dự án này chưa có Sprint.</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

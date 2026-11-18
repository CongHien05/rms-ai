import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import './project-detail.css'
import { TaskLoadGuard } from './taskLoadGuard'
import {
  applyConfirmedTaskUpdate,
  buildTaskPlanningPayload,
  type TaskPlanningPayload,
} from './taskPlanning'
import {
  summarizeTaskProgress,
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

// ── Sprint panel ──────────────────────────────────────────────────────────────

function TaskPanel({ sprint }: { sprint: Sprint }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editDueDate, setEditDueDate] = useState('')
  const [editEstimatedHours, setEditEstimatedHours] = useState('')
  const [updatingTaskIds, setUpdatingTaskIds] = useState<Record<string, boolean>>({})
  const [taskErrors, setTaskErrors] = useState<Record<string, string>>({})
  const submitting = useRef(false)
  const updatingTasksRef = useRef<Set<string>>(new Set())
  const loadGuardRef = useRef(new TaskLoadGuard())
  const request = useRef<AbortController | null>(null)

  const isAnyTaskUpdating = Object.keys(updatingTaskIds).length > 0
  const progress = summarizeTaskProgress(tasks)

  const load = useCallback(async () => {
    const loadRevision = loadGuardRef.current.beginLoad()
    if (loadRevision === null) return

    request.current?.abort()
    const ctrl = new AbortController()
    request.current = ctrl
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch(`/api/sprints/${sprint.id}/tasks`, { signal: ctrl.signal })
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
      }
    } catch {
      if (!ctrl.signal.aborted) setLoadError('Không tải được task. Thử lại.')
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
    if (!title.trim()) { setFormError('Tiêu đề Task không được để trống.'); return }
    let planning: TaskPlanningPayload
    try {
      planning = buildTaskPlanningPayload(dueDate, estimatedHours)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Thông tin Task không hợp lệ.')
      return
    }
    submitting.current = true
    setSaving(true)
    setFormError('')
    try {
      const res = await fetch(`/api/sprints/${sprint.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), ...planning }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg: string = Array.isArray(err?.message) ? (err.message as string[]).join('; ') : (typeof err?.message === 'string' ? err.message : 'Tạo task thất bại.')
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
      const res = await fetch(`/api/sprints/${sprint.id}/tasks/${taskId}`, {
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
        [taskId]: error instanceof Error ? error.message : 'Thông tin Task không hợp lệ.',
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

  return (
    <div className="task-panel">
      <form className="inline-create" onSubmit={create} noValidate>
        <div className="task-form-field task-form-field--title">
          <label htmlFor={`task-title-${sprint.id}`}>Tiêu đề Task</label>
          <input
            id={`task-title-${sprint.id}`}
            placeholder="Tiêu đề task..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={saving || isAnyTaskUpdating}
            aria-invalid={!!formError}
            aria-describedby={formError ? `task-err-${sprint.id}` : undefined}
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
          <label htmlFor={`task-estimated-hours-${sprint.id}`}>Số giờ ước tính</label>
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
        <button
          className="button button--primary task-create-submit"
          disabled={saving || loading || isAnyTaskUpdating}
          type="submit"
        >
          {saving ? 'Đang tạo...' : 'Thêm task'}
        </button>
      </form>
      {formError && <p id={`task-err-${sprint.id}`} role="alert" className="field-error">{formError}</p>}

      {loading && <p role="status" className="status-text">Đang tải task...</p>}
      {!loading && loadError && (
        <div role="alert">
          <p className="field-error">{loadError}</p>
          <button className="button button--secondary button--sm" type="button" onClick={() => void load()}>Thử lại</button>
        </div>
      )}
      {!loading && !loadError && (
        <section
          className="task-progress"
          aria-label={`Tiến độ ${sprint.name}`}
          aria-live="polite"
        >
          <p className="task-progress__label">Tiến độ theo số lượng task</p>
          {progress.total === 0 ? (
            <p className="task-progress__empty">Chưa có công việc</p>
          ) : (
            <dl className="task-progress__metrics">
              <div className="task-progress__metric">
                <dt>Tổng task</dt>
                <dd>{progress.total}</dd>
              </div>
              <div className="task-progress__metric">
                <dt>Hoàn thành</dt>
                <dd>{progress.completed}</dd>
              </div>
              <div className="task-progress__metric">
                <dt>Bị chặn</dt>
                <dd>{progress.blocked}</dd>
              </div>
              <div className="task-progress__metric">
                <dt>Tỷ lệ hoàn thành</dt>
                <dd>{progress.completionRate}%</dd>
              </div>
            </dl>
          )}
        </section>
      )}
      {!loading && !loadError && tasks.length > 0 && (
        <ul className="task-list" role="list">
          {tasks.map(task => {
            const isUpdating = !!updatingTaskIds[task.id]
            const error = taskErrors[task.id]
            return (
              <li
                key={task.id}
                className="task-item"
                role="listitem"
                data-task-id={task.id}
                data-status={task.status}
              >
                <div className="task-item__main">
                  <div className="task-summary">
                    <span className="task-title">{task.title}</span>
                    <div className="task-planning-summary">
                      <span>{task.dueDate ? `Hạn: ${task.dueDate}` : 'Chưa đặt hạn'}</span>
                      <span>
                        {task.estimatedHours === null
                          ? 'Chưa ước tính'
                          : `Ước tính: ${task.estimatedHours} giờ`}
                      </span>
                    </div>
                  </div>
                  <div className="task-controls">
                    <button
                      className="button button--secondary button--sm"
                      type="button"
                      onClick={() => beginPlanningEdit(task)}
                      disabled={saving || isAnyTaskUpdating}
                      aria-expanded={editingTaskId === task.id}
                    >
                      Sửa hạn và ước tính
                    </button>
                    <label
                      htmlFor={`task-status-${task.id}`}
                      className="sr-only"
                    >
                      Trạng thái của task {task.title}
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
                    {isUpdating && (
                      <span className="status-saving-hint">Đang lưu...</span>
                    )}
                  </div>
                </div>
                {editingTaskId === task.id && (
                  <form
                    className="task-edit-form"
                    onSubmit={e => void updatePlanning(e, task.id)}
                    noValidate
                  >
                    <div className="task-form-field">
                      <label htmlFor={`edit-task-due-date-${task.id}`}>Hạn hoàn thành</label>
                      <input
                        id={`edit-task-due-date-${task.id}`}
                        type="date"
                        value={editDueDate}
                        onChange={e => setEditDueDate(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="task-form-field">
                      <label htmlFor={`edit-task-estimated-hours-${task.id}`}>Số giờ ước tính</label>
                      <input
                        id={`edit-task-estimated-hours-${task.id}`}
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Để trống để xóa"
                        value={editEstimatedHours}
                        onChange={e => setEditEstimatedHours(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="task-edit-actions">
                      <button className="button button--primary button--sm" type="submit" disabled={isUpdating}>
                        {isUpdating ? 'Đang lưu...' : 'Lưu thông tin'}
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
                {error && (
                  <p role="alert" className="field-error task-item__error">
                    {error}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
      <div className="task-panel__footer" style={{ marginTop: '8px' }}>
        <button
          className="button button--secondary button--sm"
          type="button"
          onClick={() => void load()}
          disabled={loading || saving || isAnyTaskUpdating}
        >
          Tải lại task
        </button>
      </div>
    </div>
  )
}

// ── Sprint list ───────────────────────────────────────────────────────────────

function SprintCard({ sprint }: { sprint: Sprint }) {
  const [open, setOpen] = useState(true)

  return (
    <article className="sprint-card" data-sprint-id={sprint.id}>
      <div className="sprint-card__header">
        <h3 className="sprint-card__name">{sprint.name}</h3>
        <button
          className="button button--secondary button--sm"
          type="button"
          onClick={() => setOpen(o => !o)}
        >
          {open ? 'Ẩn task' : 'Xem task'}
        </button>
      </div>
      {open && <TaskPanel sprint={sprint} />}
    </article>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

type Project = { id: string; name: string }

interface Props {
  projectId: string
  onBack: () => void
}

export function ProjectDetailView({ projectId, onBack }: Props) {
  const [project, setProject] = useState<Project | null>(null)
  const [projectError, setProjectError] = useState('')
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [sprintName, setSprintName] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
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
      // Fetch project + sprints in parallel
      const [projRes, sprintRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`, { signal: ctrl.signal }),
        fetch(`/api/projects/${projectId}/sprints`, { signal: ctrl.signal }),
      ])
      if (!projRes.ok) {
        if (projRes.status === 404) { if (!ctrl.signal.aborted) setProjectError('Không tìm thấy dự án.'); return }
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
    if (!sprintName.trim()) { setFormError('Tên Sprint không được để trống.'); return }
    submitting.current = true
    setSaving(true)
    setFormError('')
    try {
      const res = await fetch(`/api/projects/${projectId}/sprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sprintName.trim() }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg: string = Array.isArray(err?.message) ? (err.message as string[]).join('; ') : (typeof err?.message === 'string' ? err.message : 'Tạo sprint thất bại.')
        setFormError(msg)
        return
      }
      setSprintName('')
      await load()
    } catch {
      setFormError('Chưa xác nhận kết quả. Tải lại danh sách trước khi thử lại.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (projectError) {
    return (
      <section className="workspace-view" aria-label="Chi tiết dự án">
        <button className="button button--secondary back-btn" type="button" onClick={onBack}>← Quay lại danh sách</button>
        <p role="alert" className="field-error">{projectError}</p>
      </section>
    )
  }

  return (
    <section className="workspace-view project-detail" aria-labelledby="project-detail-title">
      <header className="page-heading">
        <button className="button button--secondary back-btn" type="button" onClick={onBack}>← Quay lại</button>
        <h1 id="project-detail-title">
          {project ? project.name : (loading ? 'Đang tải...' : 'Dự án')}
        </h1>
      </header>

      {/* Sprint create form */}
      <div className="sprint-create-section">
        <h2>Sprint</h2>
        <form className="project-create" onSubmit={createSprint} noValidate>
          <label htmlFor="sprint-name">Tên sprint</label>
          <div className="project-create__controls">
            <input
              id="sprint-name"
              value={sprintName}
              onChange={e => setSprintName(e.target.value)}
              disabled={saving || loading}
              aria-invalid={!!formError}
              aria-describedby={formError ? 'sprint-error' : undefined}
            />
            <button className="button button--primary" disabled={saving || loading} type="submit">
              {saving ? 'Đang tạo...' : 'Tạo sprint'}
            </button>
          </div>
          {formError && <p id="sprint-error" role="alert">{formError}</p>}
        </form>

        <button
          className="button button--secondary"
          type="button"
          onClick={() => void load()}
          disabled={loading || saving}
        >
          Tải lại sprint
        </button>
      </div>

      {/* Sprint list */}
      {loading && <p role="status" className="status-text">Đang tải sprint...</p>}
      {!loading && loadError && (
        <div role="alert" className="error-block">
          <p>{loadError}</p>
          <button className="button button--secondary" type="button" onClick={() => void load()}>Thử lại</button>
        </div>
      )}
      {!loading && !loadError && sprints.length === 0 && (
        <p className="empty-hint">Chưa có sprint nào trong dự án này.</p>
      )}
      {!loading && !loadError && sprints.length > 0 && (
        <div className="sprint-list" role="list">
          {sprints.map(sprint => (
            <SprintCard key={sprint.id} sprint={sprint} />
          ))}
        </div>
      )}
    </section>
  )
}

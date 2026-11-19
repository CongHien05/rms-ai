import { useEffect, useRef, useState, type FormEvent } from 'react'
import { PageHeading } from '../layout/PageHeading'
import { Pagination } from '../layout/Pagination'
import { usePagination } from '../layout/usePagination'
import './projects.css'

type Project = { id: string; name: string }
const pageSize = 6

interface Props {
  onOpenProject?: (projectId: string) => void
}

export function ProjectsView({ onOpenProject }: Props = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const submitting = useRef(false)
  const request = useRef<AbortController | null>(null)
  const { items, page, pageCount, setPage } = usePagination(projects, pageSize)

  async function load() {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    try {
      const response = await fetch('/api/projects', { signal: controller.signal })
      if (!response.ok) throw new Error('load')
      const data: Project[] = await response.json()
      if (!controller.signal.aborted) {
        setProjects(data)
        return data
      }
    } catch {
      if (!controller.signal.aborted) setLoadError('Không tải được dự án. Vui lòng thử lại.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    // State updates in load happen only after the network request resolves.
    // eslint-disable-next-line react/set-state-in-effect
    void load()
    return () => request.current?.abort()
  }, [])

  function refresh() {
    setLoading(true)
    setLoadError('')
    return load()
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    setNotice('')
    if (!name.trim()) {
      setFormError('Tên dự án không được để trống.')
      return
    }
    submitting.current = true
    setSaving(true)
    setFormError('')
    try {
      const response = await fetch('/api/projects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!response.ok) throw new Error('create')
      const project: Project = await response.json()
      setProjects(current => [project, ...current.filter(item => item.id !== project.id)])
      setName('')
      setShowCreate(false)
      setPage(1)
      setNotice(`Đã tạo dự án ${project.name}.`)
      const refreshedProjects = await refresh()
      const index = refreshedProjects?.findIndex(item => item.id === project.id) ?? -1
      if (index >= 0) setPage(Math.floor(index / pageSize) + 1)
    } catch {
      setFormError('Chưa xác nhận được kết quả tạo. Hãy tải lại danh sách trước khi thử lại để tránh tạo trùng.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <section className="workspace-view" aria-labelledby="projects-view-title">
      <PageHeading id="projects-view-title" title="Dự án" actions={
        <>
          <button className="button button--secondary" type="button" onClick={() => void refresh()} disabled={loading || saving}>
            Tải lại
          </button>
          <button className="button button--primary" type="button" onClick={() => setShowCreate(true)}
            aria-expanded={showCreate} disabled={showCreate}>
            Tạo dự án
          </button>
        </>
      } />
      {showCreate && (
        <form className="panel project-create" onSubmit={create} noValidate>
          <label htmlFor="project-name">Tên dự án</label>
          <div className="project-create__controls">
            <input id="project-name" value={name} onChange={event => setName(event.target.value)} autoFocus
              disabled={saving} required aria-invalid={!!formError} aria-describedby={formError ? 'project-error' : undefined} />
            <div className="action-group">
              <button className="button button--primary" disabled={saving} type="submit">{saving ? 'Đang tạo…' : 'Tạo dự án'}</button>
              <button className="button button--secondary" disabled={saving} type="button" onClick={() => {
                setShowCreate(false)
                setFormError('')
              }}>
                Hủy
              </button>
            </div>
          </div>
          {formError && <p id="project-error" className="field-error" role="alert">{formError}</p>}
        </form>
      )}
      {notice && <p className="feedback-panel feedback-panel--success" role="status">{notice}</p>}
      {loading && <p className="feedback-panel" role="status">Đang tải dự án…</p>}
      {loadError && (
        <div className="feedback-panel feedback-panel--error">
          <p role="alert">{loadError}</p>
          <button className="button button--secondary" type="button" onClick={() => void refresh()} disabled={saving}>Thử lại</button>
        </div>
      )}
      {!loading && !loadError && (
        projects.length === 0 ? (
          <p className="feedback-panel" role="status">Chưa có dự án.</p>
        ) : (
          <div className="data-panel project-directory">
            <table className="table">
              <thead><tr><th scope="col">Tên dự án</th><th scope="col"><span className="visually-hidden">Thao tác</span></th></tr></thead>
              <tbody>
                {items.map(project => (
                  <tr key={project.id}>
                    <th scope="row">{project.name}</th>
                    <td>
                      <button className="button button--secondary" type="button" onClick={() => onOpenProject?.(project.id)}
                        aria-label={`Mở dự án ${project.name}`}>
                        Mở dự án
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination label="Phân trang dự án" page={page} pageCount={pageCount} setPage={setPage} />
          </div>
        )
      )}
    </section>
  )
}

import { useEffect, useRef, useState, type FormEvent } from 'react'
import './projects.css'

type Project = { id: string; name: string }

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const submitting = useRef(false)
  const request = useRef<AbortController | null>(null)

  async function load() {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    try {
      const response = await fetch('/api/projects', { signal: controller.signal })
      if (!response.ok) throw new Error('load')
      const data: Project[] = await response.json()
      if (!controller.signal.aborted) setProjects(data)
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
      setNotice(`Đã tạo dự án ${project.name}.`)
      await refresh()
    } catch {
      setFormError('Chưa xác nhận được kết quả tạo. Hãy tải lại danh sách trước khi thử lại để tránh tạo trùng.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <section className="workspace-view" aria-labelledby="projects-view-title">
      <header className="page-heading"><h1 id="projects-view-title">Dự án</h1></header>
      <form className="project-create" onSubmit={create} noValidate>
        <label htmlFor="project-name">Tên dự án</label>
        <div className="project-create__controls">
          <input id="project-name" value={name} onChange={event => setName(event.target.value)}
            disabled={saving} required aria-invalid={!!formError} aria-describedby={formError ? 'project-error' : undefined} />
          <button className="button button--primary" disabled={saving} type="submit">{saving ? 'Đang tạo...' : 'Tạo dự án'}</button>
        </div>
        {formError && <p id="project-error" role="alert">{formError}</p>}
      </form>
      {notice && <p role="status">{notice}</p>}
      <button className="button button--secondary" type="button" onClick={() => void refresh()} disabled={loading || saving}>Tải lại danh sách</button>
      {loading && <p role="status">Đang tải dự án...</p>}
      {loadError && <div role="alert"><p>{loadError}</p><button className="button button--secondary" onClick={() => void refresh()} disabled={saving}>Thử lại</button></div>}
      {!loading && !loadError && projects.length === 0 && <p>Chưa có dự án.</p>}
      {!loading && !loadError && <div className="workspace-list" role="list">
        {projects.map(project => <article className="workspace-row" role="listitem" key={project.id}>
          <div className="workspace-row__identity"><h2>{project.name}</h2></div>
          <p>Chưa có đánh giá rủi ro</p>
        </article>)}
      </div>}
    </section>
  )
}

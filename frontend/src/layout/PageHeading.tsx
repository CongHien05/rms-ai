import type { ReactNode } from 'react'

type Props = {
  id: string
  title: string
  description?: string
  label?: string
  actions?: ReactNode
}

export function PageHeading({ id, title, description, label, actions }: Props) {
  return (
    <header className="page-heading">
      <div className="page-heading__copy">
        <h1 id={id}>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {(label || actions) && (
        <div className="page-heading__actions">
          {label && <span className="scope-note">{label}</span>}
          {actions}
        </div>
      )}
    </header>
  )
}

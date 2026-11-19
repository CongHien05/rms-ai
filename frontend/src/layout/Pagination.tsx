type Props = {
  label: string
  page: number
  pageCount: number
  setPage: (page: number) => void
}

export function Pagination({ label, page, pageCount, setPage }: Props) {
  if (pageCount < 2) return null

  return (
    <nav className="pagination" aria-label={label}>
      <span aria-live="polite">Trang {page} / {pageCount}</span>
      <div className="pagination__buttons">
        <button type="button" className="button button--secondary button--sm" disabled={page === 1}
          onClick={() => setPage(page - 1)}>
          Trang trước
        </button>
        <button type="button" className="button button--secondary button--sm" disabled={page === pageCount}
          onClick={() => setPage(page + 1)}>
          Trang sau
        </button>
      </div>
    </nav>
  )
}

import { useState } from 'react'

export function usePagination<T>(items: readonly T[], pageSize: number) {
  const [selectedPage, setPage] = useState(1)
  const pageCount = Math.max(Math.ceil(items.length / pageSize), 1)
  const page = Math.min(selectedPage, pageCount)
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageCount,
    setPage,
  }
}

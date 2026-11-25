import { apiFetch } from '../auth/session.ts'
import { useEffect, useState } from 'react'

type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: T }

export function useHrData<T>(path: string, decode?: (value: unknown) => T) {
  const [state, setState] = useState<LoadState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const request = new AbortController()

    async function load() {
      try {
        const response = await apiFetch(path, { signal: request.signal })
        if (!response.ok) throw new Error('HR data request failed.')
        const body = await response.json()
        const data: T = decode ? decode(body) : body
        if (!request.signal.aborted) setState({ status: 'ready', data })
      } catch {
        if (!request.signal.aborted) setState({ status: 'error' })
      }
    }

    void load()
    return () => request.abort()
  }, [path, attempt, decode])

  function retry() {
    setState({ status: 'loading' })
    setAttempt(current => current + 1)
  }

  return { state, retry }
}

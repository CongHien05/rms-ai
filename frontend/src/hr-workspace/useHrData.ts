import { useEffect, useState } from 'react'

type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: T }

export function useHrData<T>(path: string) {
  const [state, setState] = useState<LoadState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const request = new AbortController()

    async function load() {
      try {
        const response = await fetch(path, { signal: request.signal })
        if (!response.ok) throw new Error('HR data request failed.')
        const data: T = await response.json()
        if (!request.signal.aborted) setState({ status: 'ready', data })
      } catch {
        if (!request.signal.aborted) setState({ status: 'error' })
      }
    }

    void load()
    return () => request.abort()
  }, [path, attempt])

  function retry() {
    setState({ status: 'loading' })
    setAttempt(current => current + 1)
  }

  return { state, retry }
}

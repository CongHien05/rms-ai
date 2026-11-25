type Rejections = { unauthorized: () => void; forbidden: () => void }

export function createApiClient(
  rejections: Rejections,
  transport: typeof fetch = (...args) => fetch(...args),
) {
  let scope = new AbortController()
  return {
    invalidate() {
      scope.abort()
      scope = new AbortController()
    },
    async request(path: string, init: RequestInit = {}, protectedRequest = true) {
      if (!path.startsWith('/api/') || path.includes('\\')) throw new Error('Yêu cầu phải dùng API cùng origin.')
      const requestScope = scope
      const signal = init.signal
        ? AbortSignal.any([requestScope.signal, init.signal])
        : requestScope.signal
      const response = await transport(path, {
        ...init,
        signal,
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
      })
      signal.throwIfAborted()
      if (protectedRequest && response.status === 401) rejections.unauthorized()
      if (protectedRequest && response.status === 403) rejections.forbidden()
      return response
    },
  }
}

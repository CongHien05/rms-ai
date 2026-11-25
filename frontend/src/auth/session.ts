import { createApiClient } from './api-client.ts'

export type Role = 'PM' | 'HR' | 'DEV'
export type Account = { accountId: string; role: Role }
type State =
  | { status: 'checking' | 'unavailable' | 'signing-out' | 'logout-error' }
  | { status: 'anonymous' | 'signing-in'; message?: string }
  | { status: 'active'; account: Account; forbidden: boolean }

function isAccount(body: unknown): body is Account {
  return typeof body === 'object' && body !== null &&
    'accountId' in body && typeof body.accountId === 'string' &&
    'role' in body && (body.role === 'PM' || body.role === 'HR' || body.role === 'DEV')
}

export function requestedProjectView(hash: string) {
  if (hash === '#projects') return { name: 'projects' as const }
  const match = /^#project\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(hash)
  return match ? { name: 'project-detail' as const, projectId: match[1].toLowerCase() } : null
}

export function createSession(transport?: typeof fetch) {
  let state: State = { status: 'checking' }
  let busy = false
  const listeners = new Set<() => void>()
  const publish = (next: State) => {
    state = next
    listeners.forEach(listener => listener())
  }
  const api = createApiClient({
    unauthorized() {
      if (state.status === 'active') {
        api.invalidate()
        publish({ status: 'anonymous', message: 'Phiên đăng nhập đã kết thúc.' })
      }
    },
    forbidden() {
      if (state.status === 'active') publish({ ...state, forbidden: true })
    },
  }, transport)

  async function readAccount(response: Response) {
    if (!response.ok) throw new Error('Không thể xác nhận phiên.')
    const body: unknown = await response.json()
    if (!isAccount(body)) throw new Error('Danh tính phản hồi không hợp lệ.')
    api.invalidate()
    publish({ status: 'active', account: body, forbidden: false })
  }

  function authRequest(path: string, init: RequestInit = {}) {
    return api.request(path, { ...init, signal: AbortSignal.timeout(10_000) }, false)
  }

  return {
    request: api.request,
    getState: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    dismissForbidden() {
      if (state.status === 'active') publish({ ...state, forbidden: false })
    },
    async restore() {
      if (busy || (state.status !== 'checking' && state.status !== 'unavailable')) return
      busy = true
      publish({ status: 'checking' })
      try {
        const response = await authRequest('/api/auth/me')
        if (response.status === 401) publish({ status: 'anonymous' })
        else await readAccount(response)
      } catch {
        publish({ status: 'unavailable' })
      } finally {
        busy = false
      }
    },
    async login(email: string, password: string) {
      if (busy || state.status !== 'anonymous') return
      busy = true
      api.invalidate()
      publish({ status: 'signing-in' })
      try {
        const response = await authRequest('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        if (response.status === 401) publish({ status: 'anonymous', message: 'Email hoặc mật khẩu không đúng.' })
        else if (response.status === 429) {
          const seconds = Number(response.headers.get('Retry-After'))
          const wait = seconds > 0 ? ` Hãy thử lại sau ${seconds} giây.` : ' Hãy đợi rồi thử lại.'
          publish({ status: 'anonymous', message: `Bạn đã thử đăng nhập nhiều lần.${wait}` })
        } else if (response.status === 400) {
          publish({ status: 'anonymous', message: 'Kiểm tra định dạng email và độ dài mật khẩu.' })
        } else if (response.status === 403) {
          publish({ status: 'anonymous', message: 'Ứng dụng không được phép gửi yêu cầu đăng nhập từ địa chỉ này.' })
        } else await readAccount(response)
      } catch {
        publish({ status: 'anonymous', message: 'Dịch vụ đăng nhập chưa khả dụng. Vui lòng thử lại.' })
      } finally {
        busy = false
      }
    },
    async logout() {
      if (busy || (state.status !== 'active' && state.status !== 'logout-error')) return
      busy = true
      api.invalidate()
      publish({ status: 'signing-out' })
      try {
        const response = await authRequest('/api/auth/logout', { method: 'POST' })
        if (response.status !== 204 && response.status !== 401) throw new Error('Đăng xuất chưa được xác nhận.')
        publish({ status: 'anonymous' })
      } catch {
        publish({ status: 'logout-error' })
      } finally {
        busy = false
      }
    },
  }
}

export const session = createSession()
export const apiFetch = session.request

import type { FormEvent, ReactNode } from 'react'
import { PageHeading } from '../layout/PageHeading'
import './login.css'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="role-preview">
      <header className="role-preview__topbar">
        <div className="role-preview__bar-content">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true">R</span>
            <strong>RMS-AI</strong>
          </div>
        </div>
      </header>
      <main className="role-preview__layout auth-layout">{children}</main>
    </div>
  )
}

export function LoginView({ pending, message, onLogin }: {
  pending: boolean
  message?: string
  onLogin: (email: string, password: string) => void
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const password = form.elements.namedItem('password') as HTMLInputElement
    const credential = String(fields.get('password') ?? '')
    password.value = ''
    onLogin(String(fields.get('email') ?? ''), credential)
  }

  return (
    <AuthLayout>
      <section className="panel auth-panel" aria-labelledby="login-title">
        <PageHeading id="login-title" title="Đăng nhập" />
        <form className="auth-form" onSubmit={submit}>
          <label>Email<input name="email" type="email" autoComplete="username" maxLength={254} required /></label>
          <label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label>
          {message && <p className="field-error" role="alert">{message}</p>}
          <button className="button button--primary" disabled={pending} type="submit">
            {pending ? 'Đang xác thực…' : 'Đăng nhập'}
          </button>
        </form>
      </section>
    </AuthLayout>
  )
}

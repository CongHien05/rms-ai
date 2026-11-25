import type { ReactNode } from 'react'

export type PrototypeRole = 'PM' | 'HR' | 'DEV'

export type NavigationItem<Section extends string = string> = {
  readonly label: string
  readonly section: Section
}

export type DecisionFlowStep = 'risk-detail' | 'recommendation' | 'simulation' | 'decision'

type AppShellProps<Section extends string> = {
  workspaceTitle: string
  role: PrototypeRole
  navigationItems: readonly NavigationItem<Section>[]
  activeSection: Section
  contextualStep: DecisionFlowStep | null
  children: ReactNode
  onNavigate: (section: Section) => void
  onLogout: () => void
}

const decisionFlow = [
  { label: 'Trung tâm rủi ro', step: 'risk-center' },
  { label: 'Chi tiết rủi ro', step: 'risk-detail' },
  { label: 'Đề xuất nhân sự', step: 'recommendation' },
  { label: 'Mô phỏng', step: 'simulation' },
  { label: 'Quyết định', step: 'decision' },
] as const

export function AppShell<Section extends string>({
  workspaceTitle,
  role,
  navigationItems,
  activeSection,
  contextualStep,
  children,
  onNavigate,
  onLogout,
}: AppShellProps<Section>) {
  const homeSection = navigationItems[0]?.section

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <button
            type="button"
            className="brand"
            onClick={() => homeSection && onNavigate(homeSection)}
            aria-label={`RMS-AI · ${workspaceTitle}`}
          >
            <span className="brand__mark" aria-hidden="true">R</span>
            <strong>RMS-AI</strong>
          </button>

          <nav className="app-nav" aria-label={`Điều hướng ${workspaceTitle}`}>
            {navigationItems.map(item => (
              <button
                type="button"
                className="app-nav__item"
                aria-current={item.section === activeSection ? 'page' : undefined}
                onClick={() => onNavigate(item.section)}
                key={item.section}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="workspace-identity">
            <span className="role-code" title={workspaceTitle}>{role}</span>
            <button className="button button--secondary button--sm" type="button" onClick={onLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {contextualStep && (
          <nav className="context-flow" aria-label="Luồng quyết định hiện tại">
            <ol>
              {decisionFlow.map(item => (
                <li key={item.step} aria-current={item.step === contextualStep ? 'step' : undefined}>
                  {item.label}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>
    </div>
  )
}

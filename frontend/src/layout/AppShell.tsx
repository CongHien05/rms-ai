import type { ReactNode } from 'react'

export type GlobalSection = 'overview' | 'projects' | 'employees' | 'risk'

export type DecisionFlowStep =
  | 'risk-detail'
  | 'recommendation'
  | 'simulation'
  | 'decision'

type AppShellProps = {
  activeSection: GlobalSection
  contextualStep: DecisionFlowStep | null
  children: ReactNode
  onNavigate: (section: GlobalSection) => void
}

const navigationItems: readonly {
  label: string
  section: GlobalSection
}[] = [
  { label: 'Tổng quan', section: 'overview' },
  { label: 'Dự án', section: 'projects' },
  { label: 'Nhân sự', section: 'employees' },
  { label: 'Trung tâm rủi ro', section: 'risk' },
]

const decisionFlow: readonly {
  label: string
  step: 'risk-center' | 'risk-detail' | 'recommendation' | 'simulation' | 'decision'
}[] = [
  { label: 'Trung tâm rủi ro', step: 'risk-center' },
  { label: 'Chi tiết rủi ro', step: 'risk-detail' },
  { label: 'Đề xuất nhân sự', step: 'recommendation' },
  { label: 'Mô phỏng', step: 'simulation' },
  { label: 'Quyết định', step: 'decision' },
]

const contextualStepIndex: Record<DecisionFlowStep, number> = {
  'risk-detail': 1,
  recommendation: 2,
  simulation: 3,
  decision: 4,
}

export function AppShell({
  activeSection,
  contextualStep,
  children,
  onNavigate,
}: AppShellProps) {
  const currentStepIndex = contextualStep
    ? contextualStepIndex[contextualStep]
    : null

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <button
            type="button"
            className="brand"
            onClick={() => onNavigate('overview')}
            aria-label="Mở tổng quan RMS-AI"
          >
            <strong>RMS-AI</strong>
            <span>Hỗ trợ quyết định nguồn lực</span>
          </button>

          <nav className="app-nav" aria-label="Điều hướng chính">
            {navigationItems.map((item) => {
              const isActive = item.section === activeSection

              return (
                <button
                  type="button"
                  className={`app-nav__item${
                    isActive ? ' app-nav__item--active' : ''
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavigate(item.section)}
                  key={item.section}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {currentStepIndex !== null && (
        <nav className="context-flow" aria-label="Luồng quyết định hiện tại">
          <ol>
            {decisionFlow.map((item, index) => (
              <li
                className={
                  index === currentStepIndex
                    ? 'context-flow__current'
                    : index < currentStepIndex
                      ? 'context-flow__past'
                      : undefined
                }
                aria-current={index === currentStepIndex ? 'step' : undefined}
                key={item.step}
              >
                {item.label}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main className="app-main">{children}</main>
    </div>
  )
}

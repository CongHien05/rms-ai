import type { ReactNode } from 'react'

export type PrototypeRole = 'PM' | 'HR' | 'DEV'

export type NavigationItem<Section extends string = string> = {
  readonly label: string
  readonly section: Section
}

export type DecisionFlowStep =
  | 'risk-detail'
  | 'recommendation'
  | 'simulation'
  | 'decision'

type AppShellProps<Section extends string> = {
  workspaceTitle: string
  role: PrototypeRole
  navigationItems: readonly NavigationItem<Section>[]
  activeSection: Section
  contextualStep: DecisionFlowStep | null
  children: ReactNode
  onNavigate: (section: Section) => void
  onExitRolePreview: () => void
}

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

export function AppShell<Section extends string>({
  workspaceTitle,
  role,
  navigationItems,
  activeSection,
  contextualStep,
  children,
  onNavigate,
  onExitRolePreview,
}: AppShellProps<Section>) {
  const currentStepIndex = contextualStep
    ? contextualStepIndex[contextualStep]
    : null
  const homeSection = navigationItems[0]?.section

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div>
          <button
            type="button"
            className="brand"
            onClick={() => homeSection && onNavigate(homeSection)}
            aria-label={`Mở trang đầu ${workspaceTitle}`}
          >
            <strong>RMS-AI</strong>
            <span>Hỗ trợ quyết định</span>
          </button>

          <div
            className="workspace-identity"
            aria-label="Không gian làm việc hiện tại"
          >
            <span className="workspace-identity__role">{role}</span>
            <span>{workspaceTitle}</span>
          </div>

          <nav className="app-nav" aria-label={`Điều hướng ${workspaceTitle}`}>
            {navigationItems.map((item, index) => {
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
                  <span aria-hidden="true">0{index + 1}</span>
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        <button
          type="button"
          className="role-preview-exit"
          onClick={onExitRolePreview}
        >
          <span aria-hidden="true">←</span>
          Đổi vai trò bản mẫu
        </button>
      </aside>

      <div className="app-workspace">
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
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}

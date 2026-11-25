import { useEffect, useState, useSyncExternalStore, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import './App.css'
import { AuthLayout, LoginView } from './auth/LoginView'
import { requestedProjectView, session, type Role } from './auth/session'
import { DevWorkspaceView } from './dev-workspace/DevWorkspaceViews'
import { EmployeesView } from './employees/EmployeesView'
import { HrOverview, HrSkillsView } from './hr-workspace/HrWorkspaceViews'
import {
  AppShell,
  type DecisionFlowStep,
  type NavigationItem,
} from './layout/AppShell'
import { OperationsOverview } from './operations-overview/OperationsOverview'
import { mockProjectRisks } from './project-risk/mockProjectRisks'
import { ProjectRiskDetail } from './project-risk/ProjectRiskDetail'
import { ProjectRiskOverview } from './project-risk/ProjectRiskOverview'
import { ProjectDetailView } from './projects/ProjectDetailView'
import { ProjectsView } from './projects/ProjectsView'
import { mockResourceRecommendations } from './resource-recommendation/mockResourceRecommendations'
import { ResourceRecommendationView } from './resource-recommendation/ResourceRecommendationView'
import { WhatIfSimulationView } from './resource-recommendation/WhatIfSimulationView'

type PmView =
  | { readonly name: 'operations-overview' }
  | { readonly name: 'projects' }
  | { readonly name: 'project-detail'; readonly projectId: string }
  | { readonly name: 'risk-overview' }
  | { readonly name: 'risk-detail'; readonly projectId: string }
  | { readonly name: 'resource-recommendation'; readonly projectId: string }
  | {
      readonly name: 'what-if'
      readonly projectId: string
      readonly candidateId: string
      readonly stage: 'simulation' | 'decision'
    }

type PmSection = 'overview' | 'projects' | 'risk'
type HrSection = 'hr-overview' | 'employees' | 'skills'
type DevSection = 'dev-overview' | 'dev-skills' | 'dev-work'

type AppState =
  | { readonly mode: 'workspace'; readonly role: 'PM'; readonly view: PmView }
  | { readonly mode: 'workspace'; readonly role: 'HR'; readonly view: HrSection }
  | { readonly mode: 'workspace'; readonly role: 'DEV'; readonly view: DevSection }

const pmNavigation: readonly NavigationItem<PmSection>[] = [
  { label: 'Tổng quan', section: 'overview' },
  { label: 'Dự án', section: 'projects' },
  { label: 'Trung tâm rủi ro', section: 'risk' },
]

const hrNavigation: readonly NavigationItem<HrSection>[] = [
  { label: 'Tổng quan', section: 'hr-overview' },
  { label: 'Nhân sự', section: 'employees' },
  { label: 'Kỹ năng', section: 'skills' },
]

const devNavigation: readonly NavigationItem<DevSection>[] = [
  { label: 'Tổng quan', section: 'dev-overview' },
  { label: 'Kỹ năng', section: 'dev-skills' },
  { label: 'Công việc', section: 'dev-work' },
]

const activePmSectionByView: Record<PmView['name'], PmSection> = {
  'operations-overview': 'overview',
  projects: 'projects',
  'project-detail': 'projects',
  'risk-overview': 'risk',
  'risk-detail': 'risk',
  'resource-recommendation': 'risk',
  'what-if': 'risk',
}

function getContextualStep(view: PmView): DecisionFlowStep | null {
  if (view.name === 'risk-detail') {
    return 'risk-detail'
  }

  if (view.name === 'resource-recommendation') {
    return 'recommendation'
  }

  if (view.name === 'what-if') {
    return view.stage
  }

  return null
}

function App() {
  const auth = useSyncExternalStore(session.subscribe, session.getState)

  useEffect(() => { void session.restore() }, [])

  if (auth.status === 'active') {
    return (
      <>
        {auth.forbidden && (
          <div role="alert" className="feedback-panel auth-notice">
            <span>Bạn không có quyền truy cập nội dung hoặc thực hiện thao tác này.</span>
            <button type="button" className="button button--secondary button--sm" onClick={session.dismissForbidden}>Đóng</button>
          </div>
        )}
        <Workspace key={auth.account.accountId} role={auth.account.role} />
      </>
    )
  }
  if (auth.status === 'anonymous' || auth.status === 'signing-in') {
    return <LoginView pending={auth.status === 'signing-in'} message={auth.message} onLogin={session.login} />
  }
  if (auth.status === 'unavailable' || auth.status === 'logout-error') {
    const logoutError = auth.status === 'logout-error'
    return (
      <AuthLayout>
        <div role="alert" className="feedback-panel feedback-panel--error auth-panel">
          <p>{logoutError ? 'Chưa xác nhận được đăng xuất. Không gian làm việc đã được ẩn.' : 'Chưa thể kết nối với dịch vụ xác thực.'}</p>
          <button type="button" className="button button--secondary" onClick={logoutError ? session.logout : session.restore}>
            {logoutError ? 'Thử đăng xuất lại' : 'Thử lại'}
          </button>
        </div>
      </AuthLayout>
    )
  }
  return <AuthLayout><p role="status">{auth.status === 'signing-out' ? 'Đang đăng xuất…' : 'Đang xác minh phiên…'}</p></AuthLayout>
}

function Workspace({ role }: { role: Role }) {
  const [appState, setAppState] = useState<AppState>(() => {
    if (role === 'PM') return { mode: 'workspace', role, view: requestedProjectView(window.location.hash) ?? { name: 'operations-overview' } }
    return role === 'HR'
      ? { mode: 'workspace', role, view: 'hr-overview' }
      : { mode: 'workspace', role, view: 'dev-overview' }
  })

  useEffect(() => {
    if (role !== 'PM') return
    function handleHash() {
      const view = requestedProjectView(window.location.hash)
      if (view) setAppState({ mode: 'workspace', role: 'PM', view })
    }
    window.addEventListener('hashchange', handleHash)
    window.addEventListener('popstate', handleHash)
    return () => {
      window.removeEventListener('hashchange', handleHash)
      window.removeEventListener('popstate', handleHash)
    }
  }, [role])

  function onLogout() {
    window.history.replaceState(null, '', window.location.pathname)
    void session.logout()
  }

  if (appState.role === 'PM') {
    return renderPmWorkspace(appState.view, setAppState, onLogout)
  }

  if (appState.role === 'HR') {
    const openHrView = (view: HrSection) => setAppState({ mode: 'workspace', role: 'HR', view })
    const hrViews: Record<HrSection, ReactNode> = {
      'hr-overview': <HrOverview onOpenEmployees={() => openHrView('employees')} onOpenSkills={() => openHrView('skills')} />,
      employees: <EmployeesView />,
      skills: <HrSkillsView />,
    }

    return (
      <AppShell
        workspaceTitle="Không gian nguồn lực"
        role="HR"
        navigationItems={hrNavigation}
        activeSection={appState.view}
        contextualStep={null}
        onNavigate={openHrView}
        onLogout={onLogout}
      >
        {hrViews[appState.view]}
      </AppShell>
    )
  }

  const openDevView = (view: DevSection) => setAppState({ mode: 'workspace', role: 'DEV', view })
  return (
    <AppShell
      workspaceTitle="Không gian cá nhân"
      role="DEV"
      navigationItems={devNavigation}
      activeSection={appState.view}
      contextualStep={null}
      onNavigate={openDevView}
      onLogout={onLogout}
    >
      <DevWorkspaceView view={appState.view} />
    </AppShell>
  )
}

type SetAppState = Dispatch<SetStateAction<AppState>>

function renderPmWorkspace(
  view: PmView,
  setAppState: SetAppState,
  onLogout: () => void,
) {
  function setPmView(nextView: PmView) {
    let hash = window.location.pathname
    if (nextView.name === 'projects') hash = '#projects'
    else if (nextView.name === 'project-detail') hash = `#project/${nextView.projectId}`
    window.history.replaceState(null, '', hash)
    setAppState({ mode: 'workspace', role: 'PM', view: nextView })
  }

  function handleSelectProject(projectId: string) {
    setPmView({ name: 'risk-detail', projectId })
  }

  function handleGlobalNavigation(section: PmSection) {
    const nextView: Record<PmSection, PmView> = {
      overview: { name: 'operations-overview' },
      projects: { name: 'projects' },
      risk: { name: 'risk-overview' },
    }

    setPmView(nextView[section])
  }

  const selectedProjectId = 'projectId' in view ? view.projectId : null
  const selectedProject = mockProjectRisks.find(
    (project) => project.id === selectedProjectId,
  )

  let content: ReactNode

  if (view.name === 'operations-overview') {
    const [featuredProject, ...projects] = mockProjectRisks

    content = (
      <OperationsOverview
        featuredProject={featuredProject}
        projects={projects}
        onOpenProjects={() => setPmView({ name: 'projects' })}
        onOpenRiskOverview={() => setPmView({ name: 'risk-overview' })}
        onSelectProject={handleSelectProject}
      />
    )
  } else if (view.name === 'projects') {
    content = (
      <ProjectsView onOpenProject={(id) => setPmView({ name: 'project-detail', projectId: id })} />
    )
  } else if (view.name === 'project-detail') {
    content = (
      <ProjectDetailView
        key={view.projectId}
        projectId={view.projectId}
        onBack={() => setPmView({ name: 'projects' })}
      />
    )
  } else if (view.name === 'risk-overview' || !selectedProject) {
    content = (
      <ProjectRiskOverview
        projects={mockProjectRisks}
        onSelectProject={handleSelectProject}
      />
    )
  } else if (view.name === 'risk-detail') {
    content = (
      <ProjectRiskDetail
        project={selectedProject}
        onBack={() => setPmView({ name: 'risk-overview' })}
        onRequestRecommendation={() =>
          setPmView({
            name: 'resource-recommendation',
            projectId: selectedProject.id,
          })
        }
      />
    )
  } else {
    const recommendation = mockResourceRecommendations.find(
      (item) => item.projectId === selectedProject.id,
    )

    if (!recommendation) {
      content = (
        <ProjectRiskOverview
          projects={mockProjectRisks}
          onSelectProject={handleSelectProject}
        />
      )
    } else if (view.name === 'resource-recommendation') {
      content = (
        <ResourceRecommendationView
          project={selectedProject}
          recommendation={recommendation}
          onBack={() =>
            setPmView({ name: 'risk-detail', projectId: selectedProject.id })
          }
          onTryCandidate={(candidateId) =>
            setPmView({
              name: 'what-if',
              projectId: selectedProject.id,
              candidateId,
              stage: 'simulation',
            })
          }
        />
      )
    } else {
      const candidate =
        recommendation.state === 'available'
          ? recommendation.candidates.find(
              (item) => item.id === view.candidateId,
            )
          : undefined

      content = candidate ? (
        <WhatIfSimulationView
          key={candidate.id}
          project={selectedProject}
          candidate={candidate}
          onShowDecision={() =>
            setPmView({
              name: 'what-if',
              projectId: selectedProject.id,
              candidateId: candidate.id,
              stage: 'decision',
            })
          }
          onBack={() =>
            setPmView({
              name: 'resource-recommendation',
              projectId: selectedProject.id,
            })
          }
        />
      ) : (
        <ResourceRecommendationView
          project={selectedProject}
          recommendation={recommendation}
          onBack={() =>
            setPmView({ name: 'risk-detail', projectId: selectedProject.id })
          }
          onTryCandidate={() => undefined}
        />
      )
    }
  }

  return (
    <AppShell
      workspaceTitle="Không gian quyết định"
      role="PM"
      navigationItems={pmNavigation}
      activeSection={activePmSectionByView[view.name]}
      contextualStep={getContextualStep(view)}
      onNavigate={handleGlobalNavigation}
      onLogout={onLogout}
    >
      {view.name !== 'projects' && view.name !== 'project-detail' && (
        <p className="scope-note">Dữ liệu minh họa · Tách biệt với dự án thật</p>
      )}
      {content}
    </AppShell>
  )
}

export default App

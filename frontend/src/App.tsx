import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import './App.css'
import {
  DevOverview,
  DevSkillsView,
  DevWorkView,
} from './dev-workspace/DevWorkspaceViews'
import { EmployeesView } from './employees/EmployeesView'
import { HrOverview, HrSkillsView } from './hr-workspace/HrWorkspaceViews'
import {
  AppShell,
  type DecisionFlowStep,
  type NavigationItem,
  type PrototypeRole,
} from './layout/AppShell'
import { OperationsOverview } from './operations-overview/OperationsOverview'
import { mockProjectRisks } from './project-risk/mockProjectRisks'
import { ProjectRiskDetail } from './project-risk/ProjectRiskDetail'
import { ProjectRiskOverview } from './project-risk/ProjectRiskOverview'
import { ProjectsView } from './projects/ProjectsView'
import { mockResourceRecommendations } from './resource-recommendation/mockResourceRecommendations'
import { ResourceRecommendationView } from './resource-recommendation/ResourceRecommendationView'
import { WhatIfSimulationView } from './resource-recommendation/WhatIfSimulationView'
import { RolePreview } from './role-preview/RolePreview'

type PmView =
  | { readonly name: 'operations-overview' }
  | { readonly name: 'projects' }
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
  | { readonly mode: 'role-preview' }
  | { readonly mode: 'workspace'; readonly role: 'PM'; readonly view: PmView }
  | { readonly mode: 'workspace'; readonly role: 'HR'; readonly view: HrSection }
  | { readonly mode: 'workspace'; readonly role: 'DEV'; readonly view: DevSection }

const pmNavigation: readonly NavigationItem<PmSection>[] = [
  { label: 'Tổng quan', section: 'overview' },
  { label: 'Dự án', section: 'projects' },
  { label: 'Trung tâm rủi ro', section: 'risk' },
]

const hrNavigation: readonly NavigationItem<HrSection>[] = [
  { label: 'Tổng quan nguồn lực', section: 'hr-overview' },
  { label: 'Nhân sự', section: 'employees' },
  { label: 'Kỹ năng', section: 'skills' },
]

const devNavigation: readonly NavigationItem<DevSection>[] = [
  { label: 'Tổng quan của tôi', section: 'dev-overview' },
  { label: 'Kỹ năng của tôi', section: 'dev-skills' },
  { label: 'Công việc của tôi', section: 'dev-work' },
]

const activePmSectionByView: Record<PmView['name'], PmSection> = {
  'operations-overview': 'overview',
  projects: 'projects',
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
  const [appState, setAppState] = useState<AppState>({ mode: 'role-preview' })

  function openRole(role: PrototypeRole) {
    if (role === 'PM') {
      setAppState({
        mode: 'workspace',
        role: 'PM',
        view: { name: 'operations-overview' },
      })
      return
    }

    if (role === 'HR') {
      setAppState({ mode: 'workspace', role: 'HR', view: 'hr-overview' })
      return
    }

    setAppState({ mode: 'workspace', role: 'DEV', view: 'dev-overview' })
  }

  function exitRolePreview() {
    setAppState({ mode: 'role-preview' })
  }

  if (appState.mode === 'role-preview') {
    return <RolePreview onSelectRole={openRole} />
  }

  if (appState.role === 'PM') {
    return renderPmWorkspace(appState.view, setAppState, exitRolePreview)
  }

  if (appState.role === 'HR') {
    const hrViews: Record<HrSection, ReactNode> = {
      'hr-overview': <HrOverview />,
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
        onNavigate={(view) =>
          setAppState({ mode: 'workspace', role: 'HR', view })
        }
        onExitRolePreview={exitRolePreview}
      >
        {hrViews[appState.view]}
      </AppShell>
    )
  }

  const devViews: Record<DevSection, ReactNode> = {
    'dev-overview': <DevOverview />,
    'dev-skills': <DevSkillsView />,
    'dev-work': <DevWorkView />,
  }

  return (
    <AppShell
      workspaceTitle="Không gian cá nhân"
      role="DEV"
      navigationItems={devNavigation}
      activeSection={appState.view}
      contextualStep={null}
      onNavigate={(view) =>
        setAppState({ mode: 'workspace', role: 'DEV', view })
      }
      onExitRolePreview={exitRolePreview}
    >
      {devViews[appState.view]}
    </AppShell>
  )
}

type SetAppState = Dispatch<SetStateAction<AppState>>

function renderPmWorkspace(
  view: PmView,
  setAppState: SetAppState,
  onExitRolePreview: () => void,
) {
  function setPmView(nextView: PmView) {
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
        onOpenRiskOverview={() => setPmView({ name: 'risk-overview' })}
        onSelectProject={handleSelectProject}
      />
    )
  } else if (view.name === 'projects') {
    content = (
      <ProjectsView
        projects={mockProjectRisks}
        onSelectProject={handleSelectProject}
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
      onExitRolePreview={onExitRolePreview}
    >
      {content}
    </AppShell>
  )
}

export default App

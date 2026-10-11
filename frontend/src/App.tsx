import { useState } from 'react'
import './App.css'
import { EmployeesView } from './employees/EmployeesView'
import {
  AppShell,
  type DecisionFlowStep,
  type GlobalSection,
} from './layout/AppShell'
import { OperationsOverview } from './operations-overview/OperationsOverview'
import { mockProjectRisks } from './project-risk/mockProjectRisks'
import { ProjectRiskDetail } from './project-risk/ProjectRiskDetail'
import { ProjectRiskOverview } from './project-risk/ProjectRiskOverview'
import { ProjectsView } from './projects/ProjectsView'
import { mockResourceRecommendations } from './resource-recommendation/mockResourceRecommendations'
import { ResourceRecommendationView } from './resource-recommendation/ResourceRecommendationView'
import { WhatIfSimulationView } from './resource-recommendation/WhatIfSimulationView'

type AppView =
  | { readonly name: 'operations-overview' }
  | { readonly name: 'projects' }
  | { readonly name: 'employees' }
  | { readonly name: 'risk-overview' }
  | { readonly name: 'risk-detail'; readonly projectId: string }
  | { readonly name: 'resource-recommendation'; readonly projectId: string }
  | {
      readonly name: 'what-if'
      readonly projectId: string
      readonly candidateId: string
      readonly stage: 'simulation' | 'decision'
    }

type AppViewName = AppView['name']

const activeSectionByView: Record<AppViewName, GlobalSection> = {
  'operations-overview': 'overview',
  projects: 'projects',
  employees: 'employees',
  'risk-overview': 'risk',
  'risk-detail': 'risk',
  'resource-recommendation': 'risk',
  'what-if': 'risk',
}

function getContextualStep(view: AppView): DecisionFlowStep | null {
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
  const [view, setView] = useState<AppView>({ name: 'operations-overview' })

  const selectedProjectId = 'projectId' in view ? view.projectId : null

  const selectedProject = mockProjectRisks.find(
    (project) => project.id === selectedProjectId,
  )

  function handleSelectProject(projectId: string) {
    setView({ name: 'risk-detail', projectId })
  }

  function handleGlobalNavigation(section: GlobalSection) {
    const nextView: Record<GlobalSection, AppView> = {
      overview: { name: 'operations-overview' },
      projects: { name: 'projects' },
      employees: { name: 'employees' },
      risk: { name: 'risk-overview' },
    }

    setView(nextView[section])
  }

  function renderCurrentView() {
    if (view.name === 'operations-overview') {
      const [featuredProject, ...projects] = mockProjectRisks

      return (
        <OperationsOverview
          featuredProject={featuredProject}
          projects={projects}
          onOpenRiskOverview={() => setView({ name: 'risk-overview' })}
          onSelectProject={handleSelectProject}
        />
      )
    }

    if (view.name === 'projects') {
      return (
        <ProjectsView
          projects={mockProjectRisks}
          onSelectProject={handleSelectProject}
        />
      )
    }

    if (view.name === 'employees') {
      return <EmployeesView />
    }

    if (view.name === 'risk-overview') {
      return (
        <ProjectRiskOverview
          projects={mockProjectRisks}
          onSelectProject={handleSelectProject}
        />
      )
    }

    if (!selectedProject) {
      return (
        <ProjectRiskOverview
          projects={mockProjectRisks}
          onSelectProject={handleSelectProject}
        />
      )
    }

    if (view.name === 'risk-detail') {
      return (
        <ProjectRiskDetail
          project={selectedProject}
          onBack={() => setView({ name: 'risk-overview' })}
          onRequestRecommendation={() =>
            setView({
              name: 'resource-recommendation',
              projectId: selectedProject.id,
            })
          }
        />
      )
    }

    const recommendation = mockResourceRecommendations.find(
      (item) => item.projectId === selectedProject.id,
    )

    if (!recommendation) {
      return null
    }

    if (view.name === 'resource-recommendation') {
      return (
        <ResourceRecommendationView
          project={selectedProject}
          recommendation={recommendation}
          onBack={() =>
            setView({ name: 'risk-detail', projectId: selectedProject.id })
          }
          onTryCandidate={(candidateId) =>
            setView({
              name: 'what-if',
              projectId: selectedProject.id,
              candidateId,
              stage: 'simulation',
            })
          }
        />
      )
    }

    if (view.name !== 'what-if') {
      return null
    }

    const candidate =
      recommendation.state === 'available'
        ? recommendation.candidates.find(
            (item) => item.id === view.candidateId,
          )
        : undefined

    if (!candidate) {
      return null
    }

    return (
      <WhatIfSimulationView
        key={candidate.id}
        project={selectedProject}
        candidate={candidate}
        onShowDecision={() =>
          setView({
            name: 'what-if',
            projectId: selectedProject.id,
            candidateId: candidate.id,
            stage: 'decision',
          })
        }
        onBack={() =>
          setView({
            name: 'resource-recommendation',
            projectId: selectedProject.id,
          })
        }
      />
    )
  }

  return (
    <AppShell
      activeSection={activeSectionByView[view.name]}
      contextualStep={getContextualStep(view)}
      onNavigate={handleGlobalNavigation}
    >
      {renderCurrentView()}
    </AppShell>
  )
}

export default App

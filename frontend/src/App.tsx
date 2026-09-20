import { useState } from 'react'
import './App.css'
import { mockProjectRisks } from './project-risk/mockProjectRisks'
import { ProjectRiskDetail } from './project-risk/ProjectRiskDetail'
import { ProjectRiskOverview } from './project-risk/ProjectRiskOverview'
import { mockResourceRecommendations } from './resource-recommendation/mockResourceRecommendations'
import { ResourceRecommendationView } from './resource-recommendation/ResourceRecommendationView'
import { WhatIfSimulationView } from './resource-recommendation/WhatIfSimulationView'

type AppView =
  | { readonly name: 'risk-overview' }
  | { readonly name: 'risk-detail'; readonly projectId: string }
  | { readonly name: 'resource-recommendation'; readonly projectId: string }
  | {
      readonly name: 'what-if'
      readonly projectId: string
      readonly candidateId: string
    }

function App() {
  const [view, setView] = useState<AppView>({ name: 'risk-overview' })

  const selectedProjectId =
    view.name === 'risk-overview' ? null : view.projectId

  const selectedProject = mockProjectRisks.find(
    (project) => project.id === selectedProjectId,
  )

  function handleSelectProject(projectId: string) {
    setView({ name: 'risk-detail', projectId })
  }

  function renderCurrentView() {
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
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="brand">
            <strong>RMS-AI</strong>
            <span>Không gian hỗ trợ ra quyết định</span>
          </div>
          <p className="workspace-label">Rủi ro dự án</p>
        </div>
      </header>

      <main className="app-main">{renderCurrentView()}</main>
    </div>
  )
}

export default App

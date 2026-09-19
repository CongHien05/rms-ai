import { useState } from 'react'
import './App.css'
import { mockProjectRisks } from './project-risk/mockProjectRisks'
import { ProjectRiskDetail } from './project-risk/ProjectRiskDetail'
import { ProjectRiskOverview } from './project-risk/ProjectRiskOverview'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showHandoffNotice, setShowHandoffNotice] = useState(false)

  const selectedProject = mockProjectRisks.find(
    (project) => project.id === selectedProjectId,
  )

  function handleSelectProject(projectId: string) {
    setSelectedProjectId(projectId)
    setShowHandoffNotice(false)
  }

  function handleBack() {
    setSelectedProjectId(null)
    setShowHandoffNotice(false)
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

      <main className="app-main">
        {selectedProject ? (
          <ProjectRiskDetail
            project={selectedProject}
            showHandoffNotice={showHandoffNotice}
            onBack={handleBack}
            onRequestRecommendation={() => setShowHandoffNotice(true)}
          />
        ) : (
          <ProjectRiskOverview
            projects={mockProjectRisks}
            onSelectProject={handleSelectProject}
          />
        )}
      </main>
    </div>
  )
}

export default App

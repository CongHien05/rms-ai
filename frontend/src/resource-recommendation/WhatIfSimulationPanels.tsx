import { useId, type ReactNode } from 'react'

export function WhatIfSimulationPanels({ scenario, impact }: { scenario: ReactNode; impact: ReactNode }) {
  const scenarioTitle = useId()
  const impactTitle = useId()
  return (
    <div className="simulation-grid">
      <section className="scenario-panel" aria-labelledby={scenarioTitle}>
        <h2 id={scenarioTitle}>Phương án</h2>
        {scenario}
      </section>
      <section className="impact-section" aria-labelledby={impactTitle} aria-live="polite">
        <h2 id={impactTitle}>Kết quả mô phỏng</h2>
        {impact}
      </section>
    </div>
  )
}

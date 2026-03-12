"use client"

import { useDashboard } from "../hooks/useDashboard"

export function OverviewCard() {
  const { stats } = useDashboard()

  if (!stats) {
    return <p>Loading metrics...</p>
  }

  return (
    <article>
      <h2>Dashboard overview</h2>
      <p>Generated: {stats.generated}</p>
      <p>Active personas: {stats.activePersonas}</p>
    </article>
  )
}

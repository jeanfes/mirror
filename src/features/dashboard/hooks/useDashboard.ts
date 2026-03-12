"use client"

import { useEffect, useState } from "react"
import type { DashboardStats } from "../types"
import { getDashboardStats } from "../services/dashboard.service"

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  return { stats }
}

import type { DashboardStats } from "../types"

export async function getDashboardStats(): Promise<DashboardStats> {
  return { generated: 124, activePersonas: 4 }
}

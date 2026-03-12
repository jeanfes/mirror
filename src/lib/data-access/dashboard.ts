import type { AccountStatus, HistoryItem, Persona, QuickStats } from "@/lib/types"
import { appApiGet } from "@/lib/data-access/client"

export async function getDashboardOverview(): Promise<{ stats: QuickStats; account: AccountStatus }> {
  return appApiGet<{ stats: QuickStats; account: AccountStatus }>("/api/dashboard/overview")
}

export async function getDashboardAccount(): Promise<{ account: AccountStatus }> {
  return appApiGet<{ account: AccountStatus }>("/api/dashboard/account")
}

export async function getDashboardHistory(): Promise<{ history: HistoryItem[] }> {
  return appApiGet<{ history: HistoryItem[] }>("/api/dashboard/history")
}

export async function getDashboardPersonas(): Promise<{ personas: Persona[] }> {
  return appApiGet<{ personas: Persona[] }>("/api/dashboard/personas")
}

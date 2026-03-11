import type { AccountStatus, HistoryItem, Persona, QuickStats } from "@/lib/types"
import { getDashboardSeed } from "@/lib/mock-data"

const backendBaseUrl = process.env.BACKEND_BASE_URL

function withUserPath(pathname: string, userId?: string) {
  if (!userId) {
    return pathname
  }

  const connector = pathname.includes("?") ? "&" : "?"
  return `${pathname}${connector}userId=${encodeURIComponent(userId)}`
}

async function fetchFromBackend<T>(pathname: string): Promise<T> {
  if (!backendBaseUrl) {
    throw new Error("BACKEND_BASE_URL is not configured")
  }

  const response = await fetch(`${backendBaseUrl}${pathname}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  })

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getOverviewSource(userId?: string): Promise<{ stats: QuickStats; account: AccountStatus }> {
  if (!backendBaseUrl) {
    const seed = getDashboardSeed()
    return { stats: seed.stats, account: seed.account }
  }

  return fetchFromBackend<{ stats: QuickStats; account: AccountStatus }>(withUserPath("/dashboard/overview", userId))
}

export async function getAccountSource(userId?: string): Promise<{ account: AccountStatus }> {
  if (!backendBaseUrl) {
    return { account: getDashboardSeed().account }
  }

  return fetchFromBackend<{ account: AccountStatus }>(withUserPath("/dashboard/account", userId))
}

export async function getHistorySource(userId?: string): Promise<{ history: HistoryItem[] }> {
  if (!backendBaseUrl) {
    return { history: getDashboardSeed().history }
  }

  return fetchFromBackend<{ history: HistoryItem[] }>(withUserPath("/dashboard/history", userId))
}

export async function getPersonasSource(userId?: string): Promise<{ personas: Persona[] }> {
  if (!backendBaseUrl) {
    return { personas: getDashboardSeed().personas }
  }

  return fetchFromBackend<{ personas: Persona[] }>(withUserPath("/dashboard/personas", userId))
}

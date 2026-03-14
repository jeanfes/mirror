import { history as seedHistory } from "@/lib/mock-data"
import type { HistoryItem } from "@/types/dashboard"

const STORAGE_KEY = "mirror_history_v1"

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `history_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function isClient() {
  return typeof window !== "undefined"
}

function getSeedHistory(): HistoryItem[] {
  return seedHistory.map((item) => ({ ...item }))
}

function readHistory(): HistoryItem[] {
  if (!isClient()) return getSeedHistory()

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return getSeedHistory()

  try {
    const parsed = JSON.parse(raw) as HistoryItem[]
    if (!Array.isArray(parsed)) return getSeedHistory()
    return parsed
  } catch {
    return getSeedHistory()
  }
}

function writeHistory(items: HistoryItem[]) {
  if (!isClient()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function listHistory(): Promise<HistoryItem[]> {
  return readHistory().sort((left, right) => right.timestamp - left.timestamp)
}

export async function toggleHistoryApplied(id: string): Promise<HistoryItem[]> {
  const next = readHistory().map((item) => {
    if (item.id !== id) return item

    return {
      ...item,
      applied: !item.applied
    }
  })

  writeHistory(next)
  return next.sort((left, right) => right.timestamp - left.timestamp)
}

export async function reuseHistoryItem(id: string): Promise<HistoryItem[]> {
  const current = readHistory()
  const source = current.find((item) => item.id === id)
  if (!source) return current.sort((left, right) => right.timestamp - left.timestamp)

  const nextItem: HistoryItem = {
    ...source,
    id: makeId(),
    source: "history_reuse",
    applied: false,
    timestamp: Date.now()
  }

  const next = [nextItem, ...current]
  writeHistory(next)
  return next.sort((left, right) => right.timestamp - left.timestamp)
}

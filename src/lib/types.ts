export type GoalType = "add_value" | "challenge" | "question" | "networking"

export interface Persona {
  id: string
  name: string
  description: string
  tone: string
  examples: [string, string, string]
  allowEmojis: boolean
  enabled: boolean
  createdAt: number
  updatedAt: number
}

export interface HistoryItem {
  id: string
  personaId: string
  postAuthor: string
  postHeadline?: string
  postSnippet: string
  generatedComment: string
  goal?: GoalType
  source?: "generated" | "alternative" | "manual_edit" | "history_reuse"
  applied?: boolean
  timestamp: number
}

export interface AccountStatus {
  plan: "Free" | "Pro" | "Elite"
  creditsRemaining: number
  renewalDate: string
}

export interface QuickStats {
  generatedThisMonth: number
  activePersonas: number
  lastGeneratedAt: number | null
}

export interface DashboardSeed {
  account: AccountStatus
  personas: Persona[]
  history: HistoryItem[]
  stats: QuickStats
}

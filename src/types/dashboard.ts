export type GoalType = "add_value" | "challenge" | "question" | "networking"

export interface Profile {
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
  profileId: string
  postAuthor: string
  postHeadline?: string
  postSnippet: string
  generatedText: string
  goal?: GoalType
  source?: "generated" | "alternative" | "manual_edit" | "history_reuse"
  applied?: boolean
  createdAt: number
}

export interface AccountStatus {
  plan: "Free" | "Pro" | "Elite"
  creditsRemaining: number
  renewalDate: string
}

export interface QuickStats {
  generatedThisMonth: number
  activeProfiles: number
  lastGeneratedAt: number | null
}

export interface DashboardSeed {
  account: AccountStatus
  profiles: Profile[]
  history: HistoryItem[]
  stats: QuickStats
}
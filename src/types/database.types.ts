
export interface VoiceProfileRow {
  id: string
  user_id: string
  name: string
  description: string | null
  tone: string | null
  banned_phrases: string[] | null
  allow_emojis: boolean
  enabled: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface StyleTrainingRow {
  id: string
  profile_id: string
  kind: "example" | "questionnaire"
  content: string | null
  questionnaire_answers: Record<string, unknown> | null
  display_order: number
}

export interface GenerationHistoryRow {
  id: string
  user_id: string
  profile_id: string | null
  platform: PlatformId
  kind: "comment" | "post" | "rewrite"
  source: "generated" | "alternative" | "manual_edit"
  status: "applied"
  post_author: string | null
  post_headline: string | null
  post_snippet: string | null
  generated_text: string
  goal: string | null
  liked: boolean | null
  feedback_note: string | null
  origin: "web" | "extension"
  input_context: Record<string, unknown> | null
  output_meta: Record<string, unknown> | null
  sync_fingerprint: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PlanQuotasRow {
  plan: "Free" | "Pro"
  monthly_generations: number
  max_profiles: number | null
  max_history_retention_days: number
  features_allowed: string[]
  price_cents: number
}

export interface UserAccountRow {
  user_id: string
  plan: PlanQuotasRow["plan"]
  credits_remaining: number
  credits_used_this_month: number
  renewal_date: string | null
  subscription_status: string | null
  last_generation_at: string | null
  provider_subscription_id: string | null
  payment_provider: string
  provider_customer_id: string | null
  last_credit_reset_at: string | null
  id: string
  created_at: string
  updated_at: string
}

export interface InvoiceRow {
  id: string
  user_id: string
  amount_paid: number
  currency: string
  status: string
  invoice_url: string | null
  period_start: string | null
  period_end: string | null
  created_at: string
}

export type GoalType = "Add Value" | "Challenge" | "Networking" | "Question" | "Proposal"
export type PlatformId = "linkedin" | "twitter" | "reddit" | "youtube" | "upwork"
export type ObjectiveScope = PlatformId[]
export type ObjectiveSource = "platform_base" | "user_custom" | "imported_pack"
export type VocabularyLevel = "simple" | "conversational" | "technical" | "academic"

export interface ObjectiveProfile {
  id: string
  name: string
  canonicalGoal: GoalType
  description: string
  strategyPrompt: string
  scope: ObjectiveScope
  source: ObjectiveSource
  active: boolean
  createdAt: number
  updatedAt: number
}

export interface UserSettings {
  language: "es" | "en" | "pt" | "fr" | "de"
  commentLanguageMode: "post" | "account"
  theme: "light" | "dark" | "system"
  activeProfileId: string | null
  defaultEmojis: boolean
  autoInsert: boolean
  objectiveLibrary: ObjectiveProfile[]
  notificationsEnabled: boolean
  desktopAlertsEnabled: boolean
  personaBio: string | null
}

export interface VoiceProfile {
  id: string
  name: string
  description: string
  tone: string
  bannedPhrases: string[]
  allowEmojis: boolean
  enabled: boolean
  createdAt: number 
  updatedAt: number 
  examples: string[] 
}

export interface GenerationHistory {
  id: string
  profileId: string | null
  profileName?: string 
  platform: PlatformId
  syncFingerprint?: string
  kind: "comment" | "post" | "rewrite"
  source: "generated" | "alternative" | "manual_edit"
  status: "applied"
  postAuthor: string
  postHeadline: string | undefined
  postSnippet: string
  generatedText: string
  goal: string | undefined
  liked?: boolean | null
  feedbackNote?: string | null
  origin: "web" | "extension"
  createdAt: number 
}

export interface UserAccount {
  plan: PlanQuotasRow["plan"]
  creditsRemaining: number
  creditsUsedThisMonth: number
  renewalDate: string | null
  subscriptionStatus: string | null
  lastGenerationAt: string | null
  quota?: PlanQuotasRow
}


export interface Invoice {
  id: string
  date: string 
  amount: string 
  status: "paid" | "pending" | "failed" | "refunded" | "void" | "unknown"
  downloadUrl: string
}

export interface PaymentMethod {
  id: string
  brand: "visa" | "mastercard" | "amex" | "unknown"
  last4: string
  expiry: string 
  isDefault: boolean
}


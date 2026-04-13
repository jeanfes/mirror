
export interface VoiceProfileRow {
  id: string
  user_id: string
  name: string
  description: string | null
  tone: string | null
  // Note: The following fields are stored for future feature expansion but not currently exposed in the UI.
  // Consider implementing advanced profile customization in v2:
  // - preferred_phrases: Phrases to encourage in generated text
  // - banned_phrases: Phrases to avoid in generated text
  // - target_length: Desired output length (in words or characters)
  preferred_phrases: string[] | null
  banned_phrases: string[] | null
  target_length: number | null
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
  content: string
  questionnaire_answers: Record<string, unknown> | null
  display_order: number
}

export interface GenerationHistoryRow {
  id: string
  user_id: string
  profile_id: string | null
  kind: "comment" | "post" | "rewrite"
  source: "generated" | "alternative" | "manual_edit" | "history_reuse"
  status: "pending" | "applied" | "dismissed"
  post_author: string | null
  post_headline: string | null
  post_snippet: string | null
  generated_text: string
  goal: string | null
  origin: "web" | "extension"
  // Note: The following fields are reserved for analytics and future metrics features.
  // They store structured data about generation context and results but are not exposed in the current UI.
  // - input_context: Context passed to the AI model (author sentiment, audience, tone hints, etc.)
  // - output_meta: Metadata about the generated text (token count, confidence scores, alternative count, etc.)
  input_context: Record<string, unknown> | null
  output_meta: Record<string, unknown> | null
  sync_fingerprint: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PlanQuotasRow {
  plan: "Free" | "Pro" | "Elite"
  monthly_generations: number
  max_profiles: number
  max_history_retention_days: number
  features_allowed: string[] | null
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

export interface UserProfile {
  id: string
  name: string
  avatarUrl: string | null
  avatarSource: "google" | "upload" | null
  passwordUpdatedAt: string | null
  createdAt: string
}

export type GoalType = "Add Value" | "Challenge" | "Networking" | "Question"
export type GoalMode = "manual" | "auto"
export type PlatformId = "linkedin" | "twitter" | "reddit" | "youtube" | "upwork"
export type PlatformDefaultObjectiveIds = Record<PlatformId, string | null>
export type ObjectiveScope = PlatformId[]
export type ObjectiveSource = "platform_base" | "user_custom" | "imported_pack"

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
  confirmBeforeApply: boolean
  goalMode: GoalMode
  goalModelVersion: number
  objectiveLibrary: ObjectiveProfile[]
  platformDefaultObjectiveIds: PlatformDefaultObjectiveIds
  notificationsEnabled: boolean
  desktopAlertsEnabled: boolean
  onboardingCompleted: boolean
}

export interface VoiceProfile {
  id: string
  name: string
  description: string
  tone: string
  preferredPhrases: string[]
  bannedPhrases: string[]
  targetLength: number | null
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
  syncFingerprint?: string
  kind: "comment" | "post" | "rewrite"
  source: "generated" | "alternative" | "manual_edit" | "history_reuse"
  status: "pending" | "applied" | "dismissed"
  postAuthor: string
  postHeadline: string | undefined
  postSnippet: string
  generatedText: string
  goal: string | undefined
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


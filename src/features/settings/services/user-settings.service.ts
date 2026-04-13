import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  GoalType,
  ObjectiveProfile,
  ObjectiveScope,
  ObjectiveSource,
  PlatformDefaultObjectiveIds,
  PlatformId,
  UserSettings
} from "@/types/database.types"

const PLATFORM_IDS: PlatformId[] = ["linkedin", "twitter", "reddit", "youtube", "upwork"]
const GOAL_SET = new Set<GoalType>(["Add Value", "Challenge", "Networking", "Question"])
const OBJECTIVE_NAME_MAX = 64
const OBJECTIVE_DESCRIPTION_MAX = 300
const OBJECTIVE_PROMPT_MAX = 1200

const baseObjectiveSeeds: Array<
  Omit<ObjectiveProfile, "active" | "createdAt" | "updatedAt">
> = [
  {
    id: "base-linkedin-job-search",
    name: "Job search positioning",
    canonicalGoal: "Networking",
    description: "Construir credibilidad para atraer oportunidades laborales.",
    strategyPrompt: "Write as a professional seeking opportunities: show fit, curiosity and business value.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-networking",
    name: "Strategic networking",
    canonicalGoal: "Networking",
    description: "Abrir conversaciones con pares y referentes.",
    strategyPrompt: "Open a high-signal networking conversation with one practical angle and a clear follow-up invitation.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-authority",
    name: "Authority via insights",
    canonicalGoal: "Add Value",
    description: "Aportar un insight practico y aplicable.",
    strategyPrompt: "Share one concrete insight and one actionable next step to position expertise.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-conversation",
    name: "Conversation starter",
    canonicalGoal: "Question",
    description: "Activar respuesta del autor y de la audiencia.",
    strategyPrompt: "Ask a focused question that triggers practical discussion and invites a reply from the author.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-followup",
    name: "Professional follow-up",
    canonicalGoal: "Challenge",
    description: "Dar contrapunto respetuoso y elevar el debate.",
    strategyPrompt: "Respectfully challenge one assumption and provide a constructive alternative viewpoint.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-upwork-proposal",
    name: "Freelance proposal",
    canonicalGoal: "Networking",
    description: "Orientado a propuesta concreta de trabajo.",
    strategyPrompt: "Respond like a freelancer proposal opener: prove relevance, reference scope and suggest a next step.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-scope-discovery",
    name: "Scope discovery",
    canonicalGoal: "Question",
    description: "Aclarar requerimientos antes de estimar.",
    strategyPrompt: "Ask diagnostic questions that clarify deliverables, constraints and timeline before committing.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-value-diff",
    name: "Value differentiation",
    canonicalGoal: "Add Value",
    description: "Mostrar enfoque y valor diferencial.",
    strategyPrompt: "Highlight a differentiated execution approach and measurable value for the client.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-close-cta",
    name: "Close with CTA",
    canonicalGoal: "Networking",
    description: "Cerrar con siguiente paso claro.",
    strategyPrompt: "Close with a clear call to action (brief call, scope confirmation, or pilot step).",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-objections",
    name: "Objection handling",
    canonicalGoal: "Challenge",
    description: "Responder objeciones con claridad y calma.",
    strategyPrompt: "Address likely client objections directly with concise trade-offs and confidence.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-twitter-hot-take",
    name: "Constructive hot take",
    canonicalGoal: "Challenge",
    description: "Contrapunto corto con propuesta concreta.",
    strategyPrompt: "Offer a concise challenge and one practical alternative in a sharp tone.",
    scope: ["twitter"],
    source: "platform_base"
  },
  {
    id: "base-twitter-thread-value",
    name: "Thread value add",
    canonicalGoal: "Add Value",
    description: "Agregar ejemplo o data en una respuesta corta.",
    strategyPrompt: "Add one useful datapoint or mini-example that extends the thread's value.",
    scope: ["twitter"],
    source: "platform_base"
  },
  {
    id: "base-reddit-context-help",
    name: "Contextual help",
    canonicalGoal: "Add Value",
    description: "Responder utilmente segun contexto del sub.",
    strategyPrompt: "Provide practical, context-aware help with clear reasoning and no fluff.",
    scope: ["reddit"],
    source: "platform_base"
  },
  {
    id: "base-reddit-question",
    name: "Clarifying question",
    canonicalGoal: "Question",
    description: "Pedir info clave para mejorar la respuesta.",
    strategyPrompt: "Ask one clarifying question that unlocks a higher-quality answer.",
    scope: ["reddit"],
    source: "platform_base"
  },
  {
    id: "base-youtube-insight",
    name: "Insightful reaction",
    canonicalGoal: "Add Value",
    description: "Aportar insight a partir del video.",
    strategyPrompt: "Add one insight that builds on the video and encourages deeper discussion.",
    scope: ["youtube"],
    source: "platform_base"
  },
  {
    id: "base-youtube-engage-question",
    name: "Engagement question",
    canonicalGoal: "Question",
    description: "Pregunta que invite comentarios de calidad.",
    strategyPrompt: "Ask a thoughtful question that encourages viewers to share specific perspectives.",
    scope: ["youtube"],
    source: "platform_base"
  }
]

function normalizeGoalMode(value: unknown): UserSettings["goalMode"] {
  return value === "auto" || value === "manual"
    ? value
    : "manual"
}

function normalizeGoal(value: unknown): GoalType | null {
  return typeof value === "string" && GOAL_SET.has(value as GoalType)
    ? (value as GoalType)
    : null
}

function isPlatformId(value: unknown): value is PlatformId {
  return typeof value === "string" && PLATFORM_IDS.includes(value as PlatformId)
}

function normalizeObjectiveScope(value: unknown): ObjectiveScope {
  if (Array.isArray(value)) {
    const set = new Set<PlatformId>()

    for (const item of value) {
      if (isPlatformId(item)) {
        set.add(item)
      }
    }

    const normalized = PLATFORM_IDS.filter((platformId) => set.has(platformId))
    return normalized.length > 0 ? normalized : [...PLATFORM_IDS]
  }

  if (value === "all") {
    return [...PLATFORM_IDS]
  }

  if (isPlatformId(value)) {
    return [value]
  }

  return [...PLATFORM_IDS]
}

function normalizeObjectiveSource(value: unknown): ObjectiveSource {
  return value === "platform_base" || value === "user_custom" || value === "imported_pack"
    ? value
    : "user_custom"
}

function nowMs() {
  return Date.now()
}

function buildBaseObjectiveLibrary(now = nowMs()): ObjectiveProfile[] {
  return baseObjectiveSeeds.map((seed) => ({
    ...seed,
    active: true,
    createdAt: now,
    updatedAt: now
  }))
}

function isObjectiveApplicable(objective: ObjectiveProfile, platformId: PlatformId): boolean {
  return objective.active && objective.scope.includes(platformId)
}

function findObjectiveById(library: ObjectiveProfile[], objectiveId: string | null | undefined): ObjectiveProfile | null {
  if (!objectiveId) {
    return null
  }

  return library.find((objective) => objective.id === objectiveId) ?? null
}

function findFallbackObjective(
  library: ObjectiveProfile[],
  platformId: PlatformId
): ObjectiveProfile | null {
  return library.find((objective) => isObjectiveApplicable(objective, platformId)) ?? null
}

function normalizeObjectiveProfile(value: unknown): ObjectiveProfile | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const candidate = value as Partial<ObjectiveProfile>
  if (typeof candidate.id !== "string" || candidate.id.trim().length === 0) {
    return null
  }

  const name = typeof candidate.name === "string" ? candidate.name.trim() : ""
  if (!name) {
    return null
  }

  const canonicalGoal = normalizeGoal(candidate.canonicalGoal)
  if (!canonicalGoal) {
    return null
  }

  const description =
    typeof candidate.description === "string"
      ? candidate.description.trim().slice(0, OBJECTIVE_DESCRIPTION_MAX)
      : ""

  const strategyPrompt =
    typeof candidate.strategyPrompt === "string"
      ? candidate.strategyPrompt.trim().slice(0, OBJECTIVE_PROMPT_MAX)
      : ""

  return {
    id: candidate.id.trim(),
    name: name.slice(0, OBJECTIVE_NAME_MAX),
    canonicalGoal,
    description,
    strategyPrompt,
    scope: normalizeObjectiveScope(candidate.scope),
    source: normalizeObjectiveSource(candidate.source),
    active: candidate.active !== false,
    createdAt: typeof candidate.createdAt === "number" ? candidate.createdAt : nowMs(),
    updatedAt: typeof candidate.updatedAt === "number" ? candidate.updatedAt : nowMs()
  }
}

function normalizeObjectiveLibrary(value: unknown): ObjectiveProfile[] {
  const byId = new Map<string, ObjectiveProfile>()

  for (const baseObjective of buildBaseObjectiveLibrary()) {
    byId.set(baseObjective.id, baseObjective)
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const objective = normalizeObjectiveProfile(item)
      if (!objective) {
        continue
      }

      byId.set(objective.id, objective)
    }
  }

  return Array.from(byId.values())
}

function normalizePlatformDefaultObjectiveIds(
  value: unknown,
  objectiveLibrary: ObjectiveProfile[]
): PlatformDefaultObjectiveIds {
  const normalized: PlatformDefaultObjectiveIds = {
    linkedin: "base-linkedin-authority",
    twitter: "base-twitter-hot-take",
    reddit: "base-reddit-question",
    youtube: "base-youtube-insight",
    upwork: "base-upwork-proposal"
  }

  const candidate =
    value && typeof value === "object"
      ? (value as Partial<Record<PlatformId, unknown>>)
      : {}

  for (const platformId of PLATFORM_IDS) {
    const candidateId = candidate[platformId]
    const candidateObjective =
      typeof candidateId === "string"
        ? findObjectiveById(objectiveLibrary, candidateId.trim())
        : null

    if (candidateObjective && isObjectiveApplicable(candidateObjective, platformId)) {
      normalized[platformId] = candidateObjective.id
      continue
    }

    const fallbackObjective = findFallbackObjective(objectiveLibrary, platformId)
    normalized[platformId] = fallbackObjective?.id ?? null
  }

  return normalized
}

const defaultObjectiveLibrary = normalizeObjectiveLibrary(null)
const defaultPlatformDefaultObjectiveIds = normalizePlatformDefaultObjectiveIds(
  null,
  defaultObjectiveLibrary
)

const defaultUserSettings: UserSettings = {
  language: "es",
  commentLanguageMode: "account",
  theme: "system",
  activeProfileId: null,
  defaultEmojis: true,
  autoInsert: false,
  confirmBeforeApply: false,
  goalMode: "manual",
  goalModelVersion: 2,
  objectiveLibrary: defaultObjectiveLibrary,
  platformDefaultObjectiveIds: defaultPlatformDefaultObjectiveIds,
  desktopAlertsEnabled: false,
  notificationsEnabled: true,
  onboardingCompleted: false
}

function mapRowToSettings(row: Record<string, unknown>): UserSettings {
  const language = row.language
  const theme = row.theme
  const activeProfileId = row.active_profile_id
  const defaultEmojis = row.default_emojis
  const autoInsert = row.auto_insert
  const confirmBeforeApply = row.confirm_before_apply
  const commentLanguageMode = row.comment_language_mode
  const desktopAlertsEnabled = row.desktop_alerts_enabled
  const notificationsEnabled = row.notifications_enabled
  const onboardingCompleted = row.onboarding_completed

  const objectiveLibrary = normalizeObjectiveLibrary(row.objective_library)
  const platformDefaultObjectiveIds = normalizePlatformDefaultObjectiveIds(
    row.platform_default_objective_ids,
    objectiveLibrary
  )

  return {
    language:
      language === "es" ||
      language === "en" ||
      language === "pt" ||
      language === "fr" ||
      language === "de"
        ? language
        : defaultUserSettings.language,
    commentLanguageMode:
      commentLanguageMode === "post" || commentLanguageMode === "account"
        ? commentLanguageMode
        : defaultUserSettings.commentLanguageMode,
    theme:
      theme === "light" || theme === "dark" || theme === "system" || theme === "auto"
        ? theme === "auto" ? "system" : theme
        : defaultUserSettings.theme,
    activeProfileId:
      typeof activeProfileId === "string" ? activeProfileId : null,
    defaultEmojis:
      typeof defaultEmojis === "boolean" ? defaultEmojis : defaultUserSettings.defaultEmojis,
    autoInsert:
      typeof autoInsert === "boolean" ? autoInsert : defaultUserSettings.autoInsert,
    confirmBeforeApply:
      typeof confirmBeforeApply === "boolean"
        ? confirmBeforeApply
        : defaultUserSettings.confirmBeforeApply,
    goalMode: normalizeGoalMode(row.goal_mode),
    goalModelVersion:
      typeof row.goal_model_version === "number"
        ? Math.max(2, row.goal_model_version)
        : 2,
    objectiveLibrary,
    platformDefaultObjectiveIds,
    desktopAlertsEnabled:
      typeof desktopAlertsEnabled === "boolean"
        ? desktopAlertsEnabled
        : defaultUserSettings.desktopAlertsEnabled,
    notificationsEnabled:
      typeof notificationsEnabled === "boolean"
        ? notificationsEnabled
        : defaultUserSettings.notificationsEnabled,
    onboardingCompleted:
      typeof onboardingCompleted === "boolean"
        ? onboardingCompleted
        : defaultUserSettings.onboardingCompleted
  }
}

export async function getUserSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSettings> {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("user_settings")
      .insert({ user_id: userId })
      .select("*")
      .single()

    if (createError) {
      throw createError
    }

    return mapRowToSettings(created)
  }

  return mapRowToSettings(data)
}

export async function updateUserSettings(
  supabase: SupabaseClient,
  userId: string,
  input: Partial<UserSettings>
): Promise<UserSettings> {
  const payload: Record<string, unknown> = {
    user_id: userId,
    updated_at: new Date().toISOString()
  }

  if (input.language !== undefined) payload.language = input.language
  if (input.commentLanguageMode !== undefined) payload.comment_language_mode = input.commentLanguageMode
  if (input.theme !== undefined) payload.theme = input.theme
  if (input.activeProfileId !== undefined) payload.active_profile_id = input.activeProfileId
  if (input.defaultEmojis !== undefined) payload.default_emojis = input.defaultEmojis
  if (input.autoInsert !== undefined) payload.auto_insert = input.autoInsert
  if (input.confirmBeforeApply !== undefined) payload.confirm_before_apply = input.confirmBeforeApply
  if (input.goalMode !== undefined) payload.goal_mode = input.goalMode
  if (input.goalModelVersion !== undefined) payload.goal_model_version = Math.max(2, input.goalModelVersion)
  if (input.objectiveLibrary !== undefined) payload.objective_library = input.objectiveLibrary
  if (input.platformDefaultObjectiveIds !== undefined) payload.platform_default_objective_ids = input.platformDefaultObjectiveIds
  if (input.desktopAlertsEnabled !== undefined) payload.desktop_alerts_enabled = input.desktopAlertsEnabled
  if (input.notificationsEnabled !== undefined) payload.notifications_enabled = input.notificationsEnabled
  if (input.onboardingCompleted !== undefined) payload.onboarding_completed = input.onboardingCompleted

  const hasObjectivePatch =
    input.objectiveLibrary !== undefined ||
    input.platformDefaultObjectiveIds !== undefined

  if (hasObjectivePatch && payload.goal_model_version === undefined) {
    payload.goal_model_version = 2
  }

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single()

  if (error) {
    throw error
  }

  return mapRowToSettings(data)
}

import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  GoalType,
  ObjectiveProfile,
  ObjectiveScope,
  ObjectiveSource,
  PlatformId,
  UserSettings
} from "@/types/database.types"

const PLATFORM_IDS: PlatformId[] = ["linkedin", "twitter", "reddit", "youtube", "upwork"]
const GOAL_SET = new Set<GoalType>(["Add Value", "Challenge", "Networking", "Question"])
const OBJECTIVE_NAME_MAX = 64
const OBJECTIVE_DESCRIPTION_MAX = 300
const OBJECTIVE_PROMPT_MAX = 1200
const USER_SETTINGS_SELECT_COLUMNS =
  "user_id, language, comment_language_mode, theme, active_profile_id, default_emojis, auto_insert, objective_library, desktop_alerts_enabled, notifications_enabled, updated_at"
const USER_PROFILE_SELECT_COLUMNS = "persona_bio"
const ACTIVE_PROFILE_INVALID_CODE = "ACTIVE_PROFILE_INVALID"

type DomainError = Error & { code?: string }

let cachedBaseObjectives: ObjectiveProfile[] | null = null

function createActiveProfileInvalidError(): DomainError {
  const error = new Error("active_profile_id must belong to current user and remain enabled") as DomainError
  error.code = ACTIVE_PROFILE_INVALID_CODE
  return error
}

function isActiveProfileConstraintError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false
  }

  const candidate = error as { code?: unknown; message?: unknown }
  const code = typeof candidate.code === "string" ? candidate.code : ""
  const message = typeof candidate.message === "string" ? candidate.message.toLowerCase() : ""

  return code === "P0001" && message.includes("active_profile_id")
}

export function isActiveProfileValidationError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false
  }

  const candidate = error as { code?: unknown }
  return candidate.code === ACTIVE_PROFILE_INVALID_CODE || isActiveProfileConstraintError(error)
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

async function fetchBaseObjectivesFromSupabase(supabase: SupabaseClient): Promise<ObjectiveProfile[]> {
  try {
    interface ObjectiveRow {
      id: string
      name: string
      canonical_goal: string
      description?: string
      strategy_prompt?: string
      scope?: string[]
      source: ObjectiveSource
    }

    const { data, error } = await supabase
      .from("objectives")
      .select("id, name, canonical_goal, description, strategy_prompt, scope, source")
      .eq("active", true)

    if (error) {
      console.warn("Failed to fetch base objectives from Supabase:", error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    const now = nowMs()
    const objectives: ObjectiveProfile[] = []
    const invalidGoals: string[] = []

    for (const obj of data as ObjectiveRow[]) {
      const goal = normalizeGoal(obj.canonical_goal)
      if (!goal) {
        invalidGoals.push(`${obj.id}:${String(obj.canonical_goal)}`)
        continue
      }

      objectives.push({
        id: obj.id,
        name: obj.name,
        canonicalGoal: goal,
        description: obj.description || "",
        strategyPrompt: obj.strategy_prompt || "",
        scope: normalizeObjectiveScope(obj.scope),
        source: obj.source as ObjectiveSource,
        active: true,
        createdAt: now,
        updatedAt: now
      })
    }

    if (invalidGoals.length > 0) {
      console.warn(
        `[BaseObjectives] Skipped ${invalidGoals.length} rows with invalid canonical_goal`,
        invalidGoals
      )
    }

    return objectives
  } catch (error) {
    console.warn("Error fetching base objectives:", error)
    return []
  }
}

async function ensureBaseObjectivesInitialized(supabase: SupabaseClient): Promise<void> {
  if (cachedBaseObjectives !== null) {
    return
  }

  cachedBaseObjectives = await fetchBaseObjectivesFromSupabase(supabase)
}

function getBaseObjectiveLibrary(): ObjectiveProfile[] {
  return cachedBaseObjectives ?? []
}

export async function initializeBaseObjectives(supabase: SupabaseClient): Promise<void> {
  try {
    cachedBaseObjectives = await fetchBaseObjectivesFromSupabase(supabase)
  } catch (error) {
    console.warn("Failed to initialize base objectives:", error)
    cachedBaseObjectives = []
  }
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
  if (!Array.isArray(value)) {
    return []
  }

  const byId = new Map<string, ObjectiveProfile>()

  for (const item of value) {
    const objective = normalizeObjectiveProfile(item)
    if (!objective) {
      continue
    }

    byId.set(objective.id, objective)
  }

  return Array.from(byId.values())
}

function mergeObjectiveLibraryWithBase(value: unknown): ObjectiveProfile[] {
  const byId = new Map<string, ObjectiveProfile>()

  for (const baseObjective of getBaseObjectiveLibrary()) {
    byId.set(baseObjective.id, baseObjective)
  }

  for (const objective of normalizeObjectiveLibrary(value)) {
    byId.set(objective.id, objective)
  }

  return Array.from(byId.values())
}

const defaultObjectiveLibrary: ObjectiveProfile[] = []

const defaultUserSettings: UserSettings = {
  language: "es",
  commentLanguageMode: "account",
  theme: "system",
  activeProfileId: null,
  defaultEmojis: true,
  autoInsert: false,
  objectiveLibrary: defaultObjectiveLibrary,
  desktopAlertsEnabled: false,
  notificationsEnabled: true,
  personaBio: null
}

function mapRowToSettings(row: Record<string, unknown>, personaBio: string | null): UserSettings {
  const language = row.language
  const theme = row.theme
  const activeProfileId = row.active_profile_id
  const defaultEmojis = row.default_emojis
  const autoInsert = row.auto_insert
  const commentLanguageMode = row.comment_language_mode
  const desktopAlertsEnabled = row.desktop_alerts_enabled
  const notificationsEnabled = row.notifications_enabled

  const objectiveLibrary = mergeObjectiveLibraryWithBase(row.objective_library)

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
    objectiveLibrary,
    desktopAlertsEnabled:
      typeof desktopAlertsEnabled === "boolean"
        ? desktopAlertsEnabled
        : defaultUserSettings.desktopAlertsEnabled,
    notificationsEnabled:
      typeof notificationsEnabled === "boolean"
        ? notificationsEnabled
        : defaultUserSettings.notificationsEnabled,
    personaBio
  }
}

async function getPersonaBio(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(USER_PROFILE_SELECT_COLUMNS)
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return typeof data?.persona_bio === "string" ? data.persona_bio : null
}

export async function getUserSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSettings> {
  await ensureBaseObjectivesInitialized(supabase)

  const { data, error } = await supabase
    .from("user_settings")
    .select(USER_SETTINGS_SELECT_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("user_settings")
      .insert({ user_id: userId })
      .select(USER_SETTINGS_SELECT_COLUMNS)
      .single()

    if (createError) {
      throw createError
    }

    const personaBio = await getPersonaBio(supabase, userId)
    return mapRowToSettings(created, personaBio)
  }

  const personaBio = await getPersonaBio(supabase, userId)
  return mapRowToSettings(data, personaBio)
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
  if (input.objectiveLibrary !== undefined) {
    payload.objective_library = mergeObjectiveLibraryWithBase(input.objectiveLibrary)
  }
  if (input.desktopAlertsEnabled !== undefined) payload.desktop_alerts_enabled = input.desktopAlertsEnabled
  if (input.notificationsEnabled !== undefined) payload.notifications_enabled = input.notificationsEnabled

  if (typeof input.activeProfileId === "string") {
    const { data: profileRow, error: profileValidationError } = await supabase
      .from("voice_profiles")
      .select("id")
      .eq("id", input.activeProfileId)
      .eq("user_id", userId)
      .eq("enabled", true)
      .is("deleted_at", null)
      .maybeSingle()

    if (profileValidationError) {
      throw profileValidationError
    }

    if (!profileRow) {
      throw createActiveProfileInvalidError()
    }
  }

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(payload, { onConflict: "user_id" })
    .select(USER_SETTINGS_SELECT_COLUMNS)
    .single()

  if (error) {
    if (isActiveProfileConstraintError(error)) {
      throw createActiveProfileInvalidError()
    }

    throw error
  }

  let nextPersonaBio: string | null

  if (input.personaBio !== undefined) {
    const { error: personaUpdateError } = await supabase
      .from("user_profiles")
      .update({ persona_bio: input.personaBio })
      .eq("id", userId)

    if (personaUpdateError) {
      throw personaUpdateError
    }

    nextPersonaBio = input.personaBio
  } else {
    nextPersonaBio = await getPersonaBio(supabase, userId)
  }

  return mapRowToSettings(data, nextPersonaBio)
}

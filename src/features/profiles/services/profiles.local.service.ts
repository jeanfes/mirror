import { profiles as seedProfiles } from "@/lib/mock-data"
import type { Persona } from "@/types/dashboard"

const STORAGE_KEY = "mirror_profiles_v1"

export interface CreateProfileInput {
  name: string
  description: string
  tone: string
  example1: string
  example2: string
  example3: string
  allowEmojis: boolean
  enabled: boolean
}

export interface UpdateProfileInput extends CreateProfileInput {
  id: string
}

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `profile_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function mapInputToProfile(input: CreateProfileInput, now: number): Persona {
  return {
    id: makeId(),
    name: input.name,
    description: input.description,
    tone: input.tone,
    examples: [input.example1, input.example2, input.example3],
    allowEmojis: input.allowEmojis,
    enabled: input.enabled,
    createdAt: now,
    updatedAt: now
  }
}

function isClient() {
  return typeof window !== "undefined"
}

function getSeedProfiles(): Persona[] {
  return seedProfiles.map((profile) => ({ ...profile, examples: [...profile.examples] as [string, string, string] }))
}

function readProfiles(): Persona[] {
  if (!isClient()) return getSeedProfiles()

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return getSeedProfiles()

  try {
    const parsed = JSON.parse(raw) as Persona[]
    if (!Array.isArray(parsed)) return getSeedProfiles()
    return parsed
  } catch {
    return getSeedProfiles()
  }
}

function writeProfiles(items: Persona[]) {
  if (!isClient()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function listProfiles(): Promise<Persona[]> {
  return readProfiles()
}

export async function createProfile(input: CreateProfileInput): Promise<Persona[]> {
  const now = Date.now()
  const current = readProfiles()
  const next = [mapInputToProfile(input, now), ...current]
  writeProfiles(next)
  return next
}

export async function updateProfile(input: UpdateProfileInput): Promise<Persona[]> {
  const current = readProfiles()
  const now = Date.now()
  const nextExamples: [string, string, string] = [input.example1, input.example2, input.example3]

  const next = current.map((profile) => {
    if (profile.id !== input.id) return profile

    return {
      ...profile,
      name: input.name,
      description: input.description,
      tone: input.tone,
      examples: nextExamples,
      allowEmojis: input.allowEmojis,
      enabled: input.enabled,
      updatedAt: now
    }
  })

  writeProfiles(next)
  return next
}

export async function deleteProfile(id: string): Promise<Persona[]> {
  const current = readProfiles()
  const next = current.filter((profile) => profile.id !== id)
  writeProfiles(next)
  return next
}

export async function toggleProfile(id: string): Promise<Persona[]> {
  const current = readProfiles()
  const now = Date.now()

  const next = current.map((profile) => {
    if (profile.id !== id) return profile
    return {
      ...profile,
      enabled: !profile.enabled,
      updatedAt: now
    }
  })

  writeProfiles(next)
  return next
}

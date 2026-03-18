import { getAuthContext } from "@/lib/supabase/auth-context"
import type { Profile } from "@/types/dashboard"

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

interface VoiceProfileRow {
	id: string
	user_id: string
	name: string
	description: string | null
	tone: string | null
	allow_emojis: boolean
	enabled: boolean
	created_at: string
	updated_at: string
}

interface StyleTrainingRow {
	profile_id: string
	content: string | null
	display_order: number
}

function mapRowToProfile(row: VoiceProfileRow, examples: string[]): Profile {
	return {
		id: row.id,
		name: row.name,
		description: row.description ?? "",
		tone: row.tone ?? "",
		examples: [examples[0] ?? "", examples[1] ?? "", examples[2] ?? ""],
		allowEmojis: row.allow_emojis,
		enabled: row.enabled,
		createdAt: Date.parse(row.created_at),
		updatedAt: Date.parse(row.updated_at)
	}
}

/**
 * Helper to fetch a single profile by ID with its examples (style_training)
 * Private - used internally by mutations
 */
async function getProfileById(
	supabase: NonNullable<Awaited<ReturnType<typeof import("@/lib/supabase/auth-context").getAuthContext>>["supabase"]>,
	userId: string,
	profileId: string
): Promise<Profile> {
	const { data: profileData, error: profileError } = await supabase
		.from("voice_profiles")
		.select("id, user_id, name, description, tone, allow_emojis, enabled, created_at, updated_at")
		.eq("id", profileId)
		.eq("user_id", userId)
		.single()

	if (profileError) {
		throw profileError
	}

	const { data: trainingData, error: trainingError } = await supabase
		.from("style_training")
		.select("profile_id, content, display_order")
		.eq("profile_id", profileId)
		.order("display_order", { ascending: true })

	if (trainingError) {
		throw trainingError
	}

	const examples = (trainingData ?? [])
		.filter((row: StyleTrainingRow) => row.content)
		.map((row: StyleTrainingRow) => row.content as string)

	return mapRowToProfile(profileData as VoiceProfileRow, examples)
}

export async function listProfiles(): Promise<Profile[]> {
	const { supabase, userId } = await getAuthContext()

	const { data: profilesData, error: profilesError } = await supabase
		.from("voice_profiles")
		.select("id, user_id, name, description, tone, allow_emojis, enabled, created_at, updated_at")
		.eq("user_id", userId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })

	if (profilesError) {
		throw profilesError
	}

	const profileRows = (profilesData ?? []) as VoiceProfileRow[]
	const profileIds = profileRows.map((profile) => profile.id)

	const examplesByProfileId = new Map<string, string[]>()
	if (profileIds.length > 0) {
		const { data: trainingData, error: trainingError } = await supabase
			.from("style_training")
			.select("profile_id, content, display_order")
			.in("profile_id", profileIds)
			.order("display_order", { ascending: true })

		if (trainingError) {
			throw trainingError
		}

		const rows = (trainingData ?? []) as StyleTrainingRow[]
		for (const row of rows) {
			const current = examplesByProfileId.get(row.profile_id) ?? []
			if (row.content) {
				current.push(row.content)
			}
			examplesByProfileId.set(row.profile_id, current)
		}
	}

	return profileRows.map((row) => mapRowToProfile(row, examplesByProfileId.get(row.id) ?? []))
}

export async function createProfile(input: CreateProfileInput): Promise<Profile> {
	const { supabase, userId } = await getAuthContext()

	const { data: createdProfile, error: createError } = await supabase
		.from("voice_profiles")
		.insert({
			user_id: userId,
			name: input.name,
			description: input.description,
			tone: input.tone,
			allow_emojis: input.allowEmojis,
			enabled: input.enabled
		})
		.select("id")
		.single()

	if (createError) {
		throw createError
	}

	const examples = [input.example1, input.example2, input.example3]
		.map((example) => example.trim())
		.filter((example) => example.length > 0)

	if (examples.length > 0) {
		const rows = examples.map((content, index) => ({
			profile_id: createdProfile.id,
			content,
			display_order: index
		}))

		const { error: examplesError } = await supabase.from("style_training").insert(rows)
		if (examplesError) {
			throw examplesError
		}
	}

	// Fetch and return the complete profile with examples
	return getProfileById(supabase, userId, createdProfile.id)
}

export async function updateProfile(input: UpdateProfileInput): Promise<Profile> {
	const { supabase, userId } = await getAuthContext()

	const { error: updateError } = await supabase
		.from("voice_profiles")
		.update({
			name: input.name,
			description: input.description,
			tone: input.tone,
			allow_emojis: input.allowEmojis,
			enabled: input.enabled,
			updated_at: new Date().toISOString()
		})
		.eq("id", input.id)
		.eq("user_id", userId)

	if (updateError) {
		throw updateError
	}

	const { error: deleteExamplesError } = await supabase
		.from("style_training")
		.delete()
		.eq("profile_id", input.id)

	if (deleteExamplesError) {
		throw deleteExamplesError
	}

	const examples = [input.example1, input.example2, input.example3]
		.map((example) => example.trim())
		.filter((example) => example.length > 0)

	if (examples.length > 0) {
		const rows = examples.map((content, index) => ({
			profile_id: input.id,
			content,
			display_order: index
		}))

		const { error: examplesError } = await supabase.from("style_training").insert(rows)
		if (examplesError) {
			throw examplesError
		}
	}

	// Fetch and return the complete updated profile
	return getProfileById(supabase, userId, input.id)
}

export async function deleteProfile(id: string): Promise<{ id: string }> {
	const { supabase, userId } = await getAuthContext()

	const { error } = await supabase
		.from("voice_profiles")
		.update({ deleted_at: new Date().toISOString() })
		.eq("id", id)
		.eq("user_id", userId)

	if (error) {
		throw error
	}

	return { id }
}

export async function toggleProfile(id: string): Promise<Profile> {
	const { supabase, userId } = await getAuthContext()

	const { data: current, error: currentError } = await supabase
		.from("voice_profiles")
		.select("enabled")
		.eq("id", id)
		.eq("user_id", userId)
		.single()

	if (currentError) {
		throw currentError
	}

	const { error: updateError } = await supabase
		.from("voice_profiles")
		.update({
			enabled: !current.enabled,
			updated_at: new Date().toISOString()
		})
		.eq("id", id)
		.eq("user_id", userId)

	if (updateError) {
		throw updateError
	}

	// Fetch and return the complete toggled profile
	return getProfileById(supabase, userId, id)
}
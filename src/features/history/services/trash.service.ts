import { getAuthContext } from "@/lib/supabase/auth-context"

export interface TrashItem {
	id: string
	title: string
	kind: "profile" | "comment" | "draft"
	deletedAt: number
	summary: string
}

interface DeletedProfileRow {
	id: string
	name: string
	description: string | null
	deleted_at: string
}

interface DeletedHistoryRow {
	id: string
	post_author: string | null
	post_snippet: string | null
	generated_text: string
	deleted_at: string
}

/**
 * Identify whether a deleted item belongs to voice_profiles or generation_history
 * @returns "profile" | "comment" | null if not found in either table
 */
async function identifyTrashItemType(
	supabase: NonNullable<Awaited<ReturnType<typeof import("@/lib/supabase/auth-context").getAuthContext>>["supabase"]>,
	userId: string,
	id: string
): Promise<"profile" | "comment" | null> {
	// Check voice_profiles first
	const { data: profile, error: profileError } = await supabase
		.from("voice_profiles")
		.select("id")
		.eq("id", id)
		.eq("user_id", userId)
		.not("deleted_at", "is", null)
		.maybeSingle()

	if (profileError) {
		throw profileError
	}

	if (profile) {
		return "profile"
	}

	// Check generation_history if not found in profiles
	const { data: history, error: historyError } = await supabase
		.from("generation_history")
		.select("id")
		.eq("id", id)
		.eq("user_id", userId)
		.not("deleted_at", "is", null)
		.maybeSingle()

	if (historyError) {
		throw historyError
	}

	return history ? "comment" : null
}

export async function listTrash(): Promise<TrashItem[]> {
	const { supabase, userId } = await getAuthContext()

	const [{ data: deletedProfiles, error: profilesError }, { data: deletedHistory, error: historyError }] = await Promise.all([
		supabase
			.from("voice_profiles")
			.select("id, name, description, deleted_at")
			.eq("user_id", userId)
			.not("deleted_at", "is", null),
		supabase
			.from("generation_history")
			.select("id, post_author, post_snippet, generated_text, deleted_at")
			.eq("user_id", userId)
			.not("deleted_at", "is", null)
	])

	if (profilesError) {
		throw profilesError
	}

	if (historyError) {
		throw historyError
	}

	const profileItems: TrashItem[] = ((deletedProfiles ?? []) as DeletedProfileRow[]).map((item) => ({
		id: item.id,
		title: item.name,
		kind: "profile",
		deletedAt: Date.parse(item.deleted_at),
		summary: item.description ?? "Deleted profile"
	}))

	const historyItems: TrashItem[] = ((deletedHistory ?? []) as DeletedHistoryRow[]).map((item) => ({
		id: item.id,
		title: item.post_author ? `Comment draft for ${item.post_author}` : "Deleted comment",
		kind: "comment",
		deletedAt: Date.parse(item.deleted_at),
		summary: item.post_snippet ?? item.generated_text
	}))

	return [...profileItems, ...historyItems].sort((a, b) => b.deletedAt - a.deletedAt)
}

export async function restoreTrashItem(id: string): Promise<{ id: string; kind: "profile" | "comment" }> {
	const { supabase, userId } = await getAuthContext()

	// Identify which table contains this item
	const kind = await identifyTrashItemType(supabase, userId, id)

	if (!kind) {
		throw new Error(`Item with id ${id} not found in trash`)
	}

	if (kind === "profile") {
		const { error } = await supabase
			.from("voice_profiles")
			.update({ deleted_at: null, updated_at: new Date().toISOString() })
			.eq("id", id)
			.eq("user_id", userId)
			.not("deleted_at", "is", null)

		if (error) {
			throw error
		}
	} else {
		const { error } = await supabase
			.from("generation_history")
			.update({ deleted_at: null, updated_at: new Date().toISOString() })
			.eq("id", id)
			.eq("user_id", userId)
			.not("deleted_at", "is", null)

		if (error) {
			throw error
		}
	}

	return { id, kind }
}

export async function deleteTrashItem(id: string): Promise<{ id: string; kind: "profile" | "comment" }> {
	const { supabase, userId } = await getAuthContext()

	// Identify which table contains this item
	const kind = await identifyTrashItemType(supabase, userId, id)

	if (!kind) {
		throw new Error(`Item with id ${id} not found in trash`)
	}

	if (kind === "profile") {
		const { error } = await supabase
			.from("voice_profiles")
			.delete()
			.eq("id", id)
			.eq("user_id", userId)
			.not("deleted_at", "is", null)

		if (error) {
			throw error
		}
	} else {
		const { error } = await supabase
			.from("generation_history")
			.delete()
			.eq("id", id)
			.eq("user_id", userId)
			.not("deleted_at", "is", null)

		if (error) {
			throw error
		}
	}

	return { id, kind }
}
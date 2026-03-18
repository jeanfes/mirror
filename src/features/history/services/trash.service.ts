import { createClient } from "@/lib/supabase/client"

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

async function getAuthContext() {
	const supabase = createClient()
	const { data, error } = await supabase.auth.getUser()

	if (error || !data.user) {
		throw new Error("Could not resolve authenticated user")
	}

	return {
		supabase,
		userId: data.user.id
	}
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

export async function restoreTrashItem(id: string): Promise<TrashItem[]> {
	const { supabase, userId } = await getAuthContext()

	const { data: restoredProfile, error: profileError } = await supabase
		.from("voice_profiles")
		.update({ deleted_at: null, updated_at: new Date().toISOString() })
		.eq("id", id)
		.eq("user_id", userId)
		.not("deleted_at", "is", null)
		.select("id")

	if (profileError) {
		throw profileError
	}

	if (!restoredProfile || restoredProfile.length === 0) {
		const { error: historyError } = await supabase
			.from("generation_history")
			.update({ deleted_at: null, updated_at: new Date().toISOString() })
			.eq("id", id)
			.eq("user_id", userId)
			.not("deleted_at", "is", null)

		if (historyError) {
			throw historyError
		}
	}

	return listTrash()
}

export async function deleteTrashItem(id: string): Promise<TrashItem[]> {
	const { supabase, userId } = await getAuthContext()

	const { data: deletedProfile, error: profileError } = await supabase
		.from("voice_profiles")
		.delete()
		.eq("id", id)
		.eq("user_id", userId)
		.not("deleted_at", "is", null)
		.select("id")

	if (profileError) {
		throw profileError
	}

	if (!deletedProfile || deletedProfile.length === 0) {
		const { error: historyError } = await supabase
			.from("generation_history")
			.delete()
			.eq("id", id)
			.eq("user_id", userId)
			.not("deleted_at", "is", null)

		if (historyError) {
			throw historyError
		}
	}

	return listTrash()
}
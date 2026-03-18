import { getAuthContext } from "@/lib/supabase/auth-context"
import type { HistoryItem } from "@/types/dashboard"

interface GenerationHistoryRow {
	id: string
	profile_id: string | null
	post_author: string | null
	post_headline: string | null
	post_snippet: string | null
	generated_text: string
	goal: string | null
	source: "generated" | "alternative" | "manual_edit" | "history_reuse"
	status: string
	output_meta: { applied?: boolean } | null
	created_at: string
	kind: string
}

function mapRowToHistoryItem(row: GenerationHistoryRow): HistoryItem {
	return {
		id: row.id,
		profileId: row.profile_id ?? "",
		postAuthor: row.post_author ?? "Unknown author",
		postHeadline: row.post_headline ?? undefined,
		postSnippet: row.post_snippet ?? "",
		generatedText: row.generated_text,
		goal: (row.goal ?? undefined) as HistoryItem["goal"],
		source: row.source,
		applied: row.output_meta?.applied ?? row.status === "applied",
		createdAt: Date.parse(row.created_at)
	}
}

export async function listHistory(): Promise<HistoryItem[]> {
	const { supabase, userId } = await getAuthContext()

	const { data, error } = await supabase
		.from("generation_history")
		.select("id, profile_id, post_author, post_headline, post_snippet, generated_text, goal, source, status, output_meta, created_at, kind")
		.eq("user_id", userId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })

	if (error) {
		throw error
	}

	return ((data ?? []) as GenerationHistoryRow[]).map(mapRowToHistoryItem)
}

export async function toggleHistoryApplied(id: string): Promise<HistoryItem[]> {
	const { supabase, userId } = await getAuthContext()

	const { data: current, error: currentError } = await supabase
		.from("generation_history")
		.select("output_meta")
		.eq("id", id)
		.eq("user_id", userId)
		.single()

	if (currentError) {
		throw currentError
	}

	const currentApplied = !!(current.output_meta as { applied?: boolean } | null)?.applied
	const nextOutputMeta = {
		...((current.output_meta as Record<string, unknown> | null) ?? {}),
		applied: !currentApplied
	}

	const { error: updateError } = await supabase
		.from("generation_history")
		.update({
			output_meta: nextOutputMeta,
			updated_at: new Date().toISOString()
		})
		.eq("id", id)
		.eq("user_id", userId)

	if (updateError) {
		throw updateError
	}

	return listHistory()
}

export async function reuseHistoryItem(id: string): Promise<HistoryItem[]> {
	const { supabase, userId } = await getAuthContext()

	const { data: source, error: sourceError } = await supabase
		.from("generation_history")
		.select("profile_id, kind, post_author, post_headline, post_snippet, generated_text, goal, input_context, output_meta")
		.eq("id", id)
		.eq("user_id", userId)
		.single()

	if (sourceError) {
		throw sourceError
	}

	const { error: insertError } = await supabase
		.from("generation_history")
		.insert({
			user_id: userId,
			profile_id: source.profile_id,
			kind: source.kind,
			source: "history_reuse",
			post_author: source.post_author,
			post_headline: source.post_headline,
			post_snippet: source.post_snippet,
			generated_text: source.generated_text,
			goal: source.goal,
			input_context: source.input_context,
			output_meta: {
				...((source.output_meta as Record<string, unknown> | null) ?? {}),
				applied: false,
				reused_from_id: id
			},
			status: "pending"
		})

	if (insertError) {
		throw insertError
	}

	return listHistory()
}
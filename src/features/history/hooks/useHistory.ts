"use client"

/**
 * useHistory — React Query hook for generation history.
 *
 * Changes from original:
 * - Accepts optional `enabled` flag for tab-based lazy loading
 * - historyKey serialization fixed: Object.values(filters) is unstable
 *   (insertion-order dependent). Explicit key prevents phantom cache misses.
 * - optimistic toggle with proper rollback
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSupabaseClient } from "@/lib/supabase/client"
import { useSession } from "@/lib/supabase/useSession"
import {
  listHistory,
  moveToTrash,
  reuseHistoryItem,
  updateHistoryStatus,
  type ListHistoryFilters,
} from "@/features/history/services/history.service"
import type { GenerationHistory } from "@/types/database.types"

export function useHistory(
  filters?: ListHistoryFilters,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()
  const { userId, isAuthenticating } = useSession()

  // Stable, deterministic key — not Object.values(filters) which is order-dependent
  const historyKey = [
    "history",
    userId,
    filters?.profileId ?? "all",
    filters?.status ?? "all",
    filters?.search ?? "",
  ]

  const query = useQuery({
    queryKey: historyKey,
    queryFn: () => listHistory(supabase, userId!, filters),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId && options?.enabled !== false,
  })

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const items = queryClient.getQueryData<GenerationHistory[]>(historyKey)
      const current = items?.find((h) => h.id === id)
      const nextStatus = current?.status === "applied" ? "pending" : "applied"
      await updateHistoryStatus(supabase, userId!, id, nextStatus)
      return { id, nextStatus }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: historyKey })
      const previous = queryClient.getQueryData<GenerationHistory[]>(historyKey)
      queryClient.setQueryData<GenerationHistory[]>(historyKey, (prev) =>
        (prev ?? []).map((h) =>
          h.id === id
            ? { ...h, status: h.status === "applied" ? "pending" : "applied" }
            : h
        )
      )
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(historyKey, ctx.previous)
    },
  })

  const reuseMutation = useMutation({
    mutationFn: (id: string) => reuseHistoryItem(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", userId] })
    },
  })

  const trashMutation = useMutation({
    mutationFn: (id: string) => moveToTrash(supabase, userId!, id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<GenerationHistory[]>(historyKey, (prev) =>
        (prev ?? []).filter((h) => h.id !== id)
      )
    },
  })

  return {
    ...query,
    isLoading: query.isPending || isAuthenticating,
    toggleHistoryApplied: toggleMutation.mutateAsync,
    reuseHistoryItem: reuseMutation.mutateAsync,
    moveToTrash: trashMutation.mutateAsync,
    isMutating:
      toggleMutation.isPending ||
      reuseMutation.isPending ||
      trashMutation.isPending,
  }
}

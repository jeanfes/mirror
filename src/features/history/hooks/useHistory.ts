"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/lib/supabase/useSession"
import {
  listHistory,
  moveToTrash,
  updateHistoryFeedback,
  type ListHistoryFilters,
} from "@/features/history/services/history.service"
import type { GenerationHistory } from "@/types/database.types"
import { createClient } from "@/lib/supabase/client"

export function useHistory(
  filters?: ListHistoryFilters,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const { userId, isAuthenticating } = useSession()

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

  const trashMutation = useMutation({
    mutationFn: (id: string) => moveToTrash(supabase, userId!, id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<GenerationHistory[]>(historyKey, (prev) =>
        (prev ?? []).filter((h) => h.id !== id)
      )
    },
  })

  const feedbackMutation = useMutation({
    mutationFn: ({
      id,
      liked,
      feedbackNote,
    }: {
      id: string
      liked?: boolean | null
      feedbackNote?: string | null
    }) =>
      updateHistoryFeedback(supabase, userId!, id, {
        liked,
        feedbackNote,
      }),
    onSuccess: (_, payload) => {
      queryClient.setQueryData<GenerationHistory[]>(historyKey, (prev) =>
        (prev ?? []).map((item) =>
          item.id === payload.id
            ? {
                ...item,
                liked: payload.liked !== undefined ? payload.liked : (item.liked ?? null),
                feedbackNote: payload.feedbackNote ?? item.feedbackNote ?? null,
              }
            : item
        )
      )
    },
  })

  return {
    ...query,
    isLoading: query.isPending || isAuthenticating,
    moveToTrash: trashMutation.mutateAsync,
    updateFeedback: feedbackMutation.mutateAsync,
    isMutating: trashMutation.isPending || feedbackMutation.isPending,
  }
}

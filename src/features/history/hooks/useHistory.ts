"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/lib/supabase/useSession"
import {
  listHistory,
  moveToTrash,
  reuseHistoryItem,
  updateHistoryStatus,
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

  const resolveNextStatus = (status: GenerationHistory["status"] | undefined): "pending" | "applied" => {
    if (status === "applied") {
      return "pending"
    }

    if (status === "dismissed") {
      return "pending"
    }

    return "applied"
  }

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
      const nextStatus = resolveNextStatus(current?.status)
      await updateHistoryStatus(supabase, userId!, id, nextStatus)
      return { id, nextStatus }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: historyKey })
      const previous = queryClient.getQueryData<GenerationHistory[]>(historyKey)
      queryClient.setQueryData<GenerationHistory[]>(historyKey, (prev) =>
        (prev ?? []).map((h) =>
          h.id === id
            ? { ...h, status: resolveNextStatus(h.status) }
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

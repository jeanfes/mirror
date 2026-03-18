"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"
import { listHistory, reuseHistoryItem, toggleHistoryApplied } from "@/features/history/services/history.service"

export function useHistory() {
  const queryClient = useQueryClient()
  const userId = useUserId()
  const historyKey = userId ? makeQueryKey("history", userId) : ["history"]

  const query = useQuery({
    queryKey: historyKey,
    queryFn: listHistory,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleHistoryApplied(id),
    onSuccess: (next) => {
      queryClient.setQueryData(historyKey, next)
    }
  })

  const reuseMutation = useMutation({
    mutationFn: (id: string) => reuseHistoryItem(id),
    onSuccess: (next) => {
      queryClient.setQueryData(historyKey, next)
    }
  })

  return {
    ...query,
    toggleHistoryApplied: toggleMutation.mutateAsync,
    reuseHistoryItem: reuseMutation.mutateAsync,
    isMutating: toggleMutation.isPending || reuseMutation.isPending
  }
}

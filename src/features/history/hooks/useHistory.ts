"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listHistory, reuseHistoryItem, toggleHistoryApplied } from "@/features/history/services/history.service"

const historyKey = ["history"]

export function useHistory() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: historyKey,
    queryFn: listHistory,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false
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

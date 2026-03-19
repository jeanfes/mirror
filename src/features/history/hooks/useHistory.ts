"use client"

import { listHistory, moveToTrash, reuseHistoryItem, updateHistoryStatus, type ListHistoryFilters } from "@/features/history/services/history.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"

export function useHistory(filters?: ListHistoryFilters) {
  const queryClient = useQueryClient()
  const { userId, isAuthenticating } = useUserId()
  const historyKey = userId ? [...makeQueryKey("history", userId), ...Object.values(filters ?? {})] : ["history", ...Object.values(filters ?? {})]

  const query = useQuery({
    queryKey: historyKey,
    queryFn: () => listHistory(filters),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => updateHistoryStatus(id, "applied"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userId ? makeQueryKey("history", userId) : ["history"] })
    }
  })

  const reuseMutation = useMutation({
    mutationFn: (id: string) => reuseHistoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userId ? makeQueryKey("history", userId) : ["history"] })
    }
  })

  const trashMutation = useMutation({
    mutationFn: (id: string) => moveToTrash(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userId ? makeQueryKey("history", userId) : ["history"] })
    }
  })

  return {
    ...query,
    isLoading: query.isPending || isAuthenticating,
    toggleHistoryApplied: toggleMutation.mutateAsync,
    reuseHistoryItem: reuseMutation.mutateAsync,
    moveToTrash: trashMutation.mutateAsync,
    isMutating: toggleMutation.isPending || reuseMutation.isPending || trashMutation.isPending
  }

}


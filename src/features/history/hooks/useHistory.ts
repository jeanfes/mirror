"use client"

import { listHistory, moveToTrash, reuseHistoryItem, updateHistoryStatus, type ListHistoryFilters } from "@/features/history/services/history.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSupabaseClient } from "@/lib/supabase/client"
import { useSession } from "@/lib/supabase/useSession"

export function useHistory(filters?: ListHistoryFilters) {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()
  const { userId, isAuthenticating } = useSession()
  const historyKey = ["history", userId, ...Object.values(filters ?? {})]

  const query = useQuery({
    queryKey: historyKey,
    queryFn: () => listHistory(supabase, userId!, filters),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => updateHistoryStatus(supabase, userId!, id, "applied"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", userId] })
    }
  })

  const reuseMutation = useMutation({
    mutationFn: (id: string) => reuseHistoryItem(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", userId] })
    }
  })

  const trashMutation = useMutation({
    mutationFn: (id: string) => moveToTrash(supabase, userId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", userId] })
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


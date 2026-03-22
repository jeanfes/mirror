"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSupabaseClient } from "@/lib/supabase/client"
import { useSession } from "@/lib/supabase/useSession"
import {
  getUserSettings,
  updateUserSettings,
} from "@/features/settings/services/user-settings.service"
import type { UserSettings } from "@/types/database.types"

export function useUserSettings() {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()
  const { userId, isAuthenticating } = useSession()
  const settingsKey = ["user-settings", userId]

  const query = useQuery({
    queryKey: settingsKey,
    queryFn: () => getUserSettings(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })

  const mutation = useMutation({
    mutationFn: (input: Partial<UserSettings>) =>
      updateUserSettings(supabase, userId!, input),
    onSuccess: (next) => {
      queryClient.setQueryData<UserSettings>(settingsKey, next)
    },
  })

  return {
    ...query,
    isLoading: query.isPending || isAuthenticating,
    updateSettings: mutation.mutateAsync,
    isMutating: mutation.isPending,
  }
}

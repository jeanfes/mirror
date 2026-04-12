"use client"

import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query"
import { useSession } from "@/lib/supabase/useSession"
import { createClient } from "@/lib/supabase/client"
import {
  getUserSettings,
  updateUserSettings,
} from "@/features/settings/services/user-settings.service"
import type { UserSettings } from "@/types/database.types"

type UseUserSettingsResult = Omit<UseQueryResult<UserSettings, Error>, "isLoading"> & {
  isLoading: boolean
  updateSettings: (input: Partial<UserSettings>) => Promise<UserSettings>
  isMutating: boolean
}

export function useUserSettings(): UseUserSettingsResult {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const { userId, isAuthenticating } = useSession()
  const settingsKey = ["user-settings", userId] as const

  const query = useQuery<UserSettings, Error>({
    queryKey: settingsKey,
    queryFn: () => getUserSettings(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })

  const mutation = useMutation<UserSettings, Error, Partial<UserSettings>>({
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

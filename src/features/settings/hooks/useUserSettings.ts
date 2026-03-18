"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"
import {
  getUserSettings,
  updateUserSettings
} from "@/features/settings/services/user-settings.service"
import type { UserSettings } from "@/types/database.types"

export function useUserSettings() {
  const queryClient = useQueryClient()
  const userId = useUserId()
  const settingsKey = userId ? makeQueryKey("user-settings", userId) : ["user-settings"]

  const query = useQuery({
    queryKey: settingsKey,
    queryFn: getUserSettings,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const mutation = useMutation({
    mutationFn: (input: Partial<UserSettings>) => updateUserSettings(input),
    onSuccess: (next) => {
      queryClient.setQueryData<UserSettings>(settingsKey, next)
    }
  })

  return {
    ...query,
    updateSettings: mutation.mutateAsync,
    isMutating: mutation.isPending
  }
}

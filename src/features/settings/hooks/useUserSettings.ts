"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getUserSettings,
  updateUserSettings,
  type UpdateUserSettingsInput,
  type UserSettings
} from "@/features/settings/services/user-settings.service"

const settingsKey = ["user-settings"]

export function useUserSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: settingsKey,
    queryFn: getUserSettings,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false
  })

  const mutation = useMutation({
    mutationFn: (input: UpdateUserSettingsInput) => updateUserSettings(input),
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

"use client"

import { useCallback, useMemo, useRef } from "react"
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
  const settingsKey = useMemo(() => ["user-settings", userId] as const, [userId])

  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const stagedChangesRef = useRef<Partial<UserSettings>>({})
  const resolversRef = useRef<{ resolve: (s: UserSettings) => void; reject: (e: unknown) => void }[]>([])

  const query = useQuery<UserSettings, Error>({
    queryKey: settingsKey,
    queryFn: () => getUserSettings(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })

  const mutation = useMutation<UserSettings, Error, Partial<UserSettings>, { previousSettings?: UserSettings }>({
    mutationFn: (input: Partial<UserSettings>) =>
      updateUserSettings(supabase, userId!, input),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: settingsKey })
      const previousSettings = queryClient.getQueryData<UserSettings>(settingsKey)

      if (previousSettings) {
        queryClient.setQueryData<UserSettings>(settingsKey, {
          ...previousSettings,
          ...newSettings,
        })
      }

      return { previousSettings }
    },
    onError: (err, newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData<UserSettings>(settingsKey, context.previousSettings)
      }
    },
    onSuccess: (next) => {
      queryClient.setQueryData<UserSettings>(settingsKey, next)
    },
  })

  const updateSettings = useCallback(
    (input: Partial<UserSettings>) => {
      // 1. Immediate optimistic update for visual snap
      const previous = queryClient.getQueryData<UserSettings>(settingsKey)
      if (previous) {
        queryClient.setQueryData<UserSettings>(settingsKey, { ...previous, ...input })
      }

      // 2. Clear previous timer and buffer changes
      if (timerRef.current) clearTimeout(timerRef.current)
      stagedChangesRef.current = { ...stagedChangesRef.current, ...input }

      // 3. Queue resolver for the batch
      return new Promise<UserSettings>((resolve, reject) => {
        resolversRef.current.push({ resolve, reject })
        
        timerRef.current = setTimeout(async () => {
          const payload = { ...stagedChangesRef.current }
          const pendingResolvers = [...resolversRef.current]
          
          stagedChangesRef.current = {}
          resolversRef.current = []

          try {
            const result = await mutation.mutateAsync(payload)
            pendingResolvers.forEach(r => r.resolve(result))
          } catch (err) {
            pendingResolvers.forEach(r => r.reject(err))
          }
        }, 500)
      })
    },
    [mutation, queryClient, settingsKey]
  )

  return {
    ...query,
    isLoading: query.isPending || (query.isFetching && !query.data) || isAuthenticating,
    updateSettings,
    isMutating: mutation.isPending || (!!stagedChangesRef.current && Object.keys(stagedChangesRef.current).length > 0),
  }
}

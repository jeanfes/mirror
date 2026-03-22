"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSupabaseClient } from "@/lib/supabase/client"
import { useSession } from "@/lib/supabase/useSession"
import {
  createProfile,
  moveToTrash,
  listProfiles,
  toggleProfile,
  updateProfile,
  type CreateProfileInput,
  type UpdateProfileInput
} from "@/features/profiles/services/profiles.service"
import type { VoiceProfile } from "@/types/database.types"

export function useProfiles() {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()
  const { userId, isAuthenticating } = useSession()
  const profilesKey = ["profiles", userId]

  const query = useQuery({
    queryKey: profilesKey,
    queryFn: () => listProfiles(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateProfileInput) => createProfile(supabase, userId!, input),
    onSuccess: (created) => {
      queryClient.setQueryData(profilesKey, (prev: VoiceProfile[] | undefined) => [created, ...(prev ?? [])])
    }
  })

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(supabase, userId!, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(profilesKey, (prev: VoiceProfile[] | undefined) =>
        (prev ?? []).map((p) => (p.id === updated.id ? updated : p))
      )
    }
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, currentEnabled }: { id: string; currentEnabled: boolean }) =>
      toggleProfile(supabase, userId!, id, currentEnabled),
    onMutate: async ({ id, currentEnabled }) => {
      await queryClient.cancelQueries({ queryKey: profilesKey })
      const previous = queryClient.getQueryData<VoiceProfile[]>(profilesKey)
      queryClient.setQueryData(profilesKey, (prev: VoiceProfile[] | undefined) =>
        (prev ?? []).map((p) => (p.id === id ? { ...p, enabled: !currentEnabled } : p))
      )
      return { previous }
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(profilesKey, ctx.previous)
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => moveToTrash(supabase, userId!, id),
    onSuccess: (result) => {
      queryClient.setQueryData(profilesKey, (prev: VoiceProfile[] | undefined) =>
        (prev ?? []).filter((p) => p.id !== result.id)
      )
    }
  })

  return {
    ...query,
    isLoading: query.isPending || isAuthenticating,
    createProfile: createMutation.mutateAsync,
    updateProfile: updateMutation.mutateAsync,
    toggleProfile: (id: string, currentEnabled: boolean) => toggleMutation.mutateAsync({ id, currentEnabled }),
    deleteProfile: deleteMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      toggleMutation.isPending ||
      deleteMutation.isPending
  }
}

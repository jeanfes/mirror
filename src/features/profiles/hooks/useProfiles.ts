"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/lib/supabase/useSession"
import {
  createProfile,
  moveToTrash,
  listProfiles,
  toggleProfile,
  updateProfile,
  type CreateProfileInput,
  type UpdateProfileInput,
} from "@/features/profiles/services/profiles.service"
import type { VoiceProfile } from "@/types/database.types"
import { createClient } from "@/lib/supabase/client"

export function useProfiles(options?: { enabled?: boolean }) {
  const { userId, isAuthenticating } = useSession()
  const profilesKey = ["profiles", userId]
  const queryClient = useQueryClient()
  const supabase = createClient()

  const query = useQuery({
    queryKey: profilesKey,
    queryFn: () => listProfiles(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId && options?.enabled !== false,
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateProfileInput) => createProfile(supabase, userId!, input),
    onSuccess: (created) => {
      queryClient.setQueryData<VoiceProfile[]>(profilesKey, (prev) => [
        created,
        ...(prev ?? []),
      ])
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(supabase, userId!, input),
    onSuccess: (updated) => {
      queryClient.setQueryData<VoiceProfile[]>(profilesKey, (prev) =>
        (prev ?? []).map((p) => (p.id === updated.id ? updated : p))
      )
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, currentEnabled }: { id: string; currentEnabled: boolean }) =>
      toggleProfile(supabase, userId!, id, currentEnabled),
    onMutate: async ({ id, currentEnabled }) => {
      await queryClient.cancelQueries({ queryKey: profilesKey })
      const previous = queryClient.getQueryData<VoiceProfile[]>(profilesKey)
      queryClient.setQueryData<VoiceProfile[]>(profilesKey, (prev) =>
        (prev ?? []).map((p) => (p.id === id ? { ...p, enabled: !currentEnabled } : p))
      )
      return { previous }
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(profilesKey, ctx.previous)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => moveToTrash(supabase, userId!, id),
    onSuccess: (result) => {
      queryClient.setQueryData<VoiceProfile[]>(profilesKey, (prev) =>
        (prev ?? []).filter((p) => p.id !== result.id)
      )
    },
  })

  return {
    ...query,
    isLoading: query.isPending || isAuthenticating,
    createProfile: createMutation.mutateAsync,
    updateProfile: updateMutation.mutateAsync,
    toggleProfile: (id: string, currentEnabled: boolean) =>
      toggleMutation.mutateAsync({ id, currentEnabled }),
    deleteProfile: deleteMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      toggleMutation.isPending ||
      deleteMutation.isPending,
  }
}

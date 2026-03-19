"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"
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
  const { userId, isAuthenticating } = useUserId()
  const profilesKey = userId ? makeQueryKey("profiles", userId) : ["profiles"]

  const query = useQuery({
    queryKey: profilesKey,
    queryFn: listProfiles,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateProfileInput) => createProfile(input),
    onSuccess: (created) => {
      queryClient.setQueryData(profilesKey, (prev: VoiceProfile[] | undefined) => [created, ...(prev ?? [])])
    }
  })

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(profilesKey, (prev: VoiceProfile[] | undefined) =>
        (prev ?? []).map((p) => p.id === updated.id ? updated : p)
      )
    }
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleProfile(id),
    onSuccess: (toggled) => {
      queryClient.setQueryData(profilesKey, (prev: VoiceProfile[] | undefined) =>
        (prev ?? []).map((p) => p.id === toggled.id ? toggled : p)
      )
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => moveToTrash(id),
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
    toggleProfile: toggleMutation.mutateAsync,
    deleteProfile: deleteMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      toggleMutation.isPending ||
      deleteMutation.isPending
  }
}

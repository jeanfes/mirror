"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createProfile,
  deleteProfile,
  listProfiles,
  toggleProfile,
  updateProfile,
  type CreateProfileInput,
  type UpdateProfileInput
} from "@/features/profiles/services/profiles.service"

const profilesKey = ["profiles"]

export function useProfiles() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: profilesKey,
    queryFn: listProfiles,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateProfileInput) => createProfile(input),
    onSuccess: (next) => {
      queryClient.setQueryData(profilesKey, next)
    }
  })

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (next) => {
      queryClient.setQueryData(profilesKey, next)
    }
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleProfile(id),
    onSuccess: (next) => {
      queryClient.setQueryData(profilesKey, next)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: (next) => {
      queryClient.setQueryData(profilesKey, next)
    }
  })

  return {
    ...query,
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

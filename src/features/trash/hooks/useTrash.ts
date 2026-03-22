"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSupabaseClient } from "@/lib/supabase/client"
import { useSession } from "@/lib/supabase/useSession"
import {
  listTrash,
  restoreTrashItem,
  deleteTrashItem,
  type TrashItem,
} from "@/features/trash/services/trash.service"

export function useTrash() {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()
  const { userId, isAuthenticating } = useSession()
  const trashKey = ["trash", userId]

  const query = useQuery<TrashItem[]>({
    queryKey: trashKey,
    queryFn: () => listTrash(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })

  const restoreMutation = useMutation<
    { id: string; kind: "profile" | "comment" },
    Error,
    string
  >({
    mutationFn: (id: string) => restoreTrashItem(supabase, userId!, id),
    onSuccess: (result) => {
      queryClient.setQueryData<TrashItem[]>(trashKey, (prev) =>
        prev?.filter((item) => item.id !== result.id) ?? []
      )
    },
  })

  const deleteMutation = useMutation<
    { id: string; kind: "profile" | "comment" },
    Error,
    string
  >({
    mutationFn: (id: string) => deleteTrashItem(supabase, userId!, id),
    onSuccess: (result) => {
      queryClient.setQueryData<TrashItem[]>(trashKey, (prev) =>
        prev?.filter((item) => item.id !== result.id) ?? []
      )
    },
  })

  return {
    ...query,
    isLoading: query.isLoading || isAuthenticating,
    restore: restoreMutation.mutateAsync,
    deleteForever: deleteMutation.mutateAsync,
    isMutating: restoreMutation.isPending || deleteMutation.isPending,
  }
}

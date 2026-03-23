"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/lib/supabase/useSession"
import { createClient } from "@/lib/supabase/client"
import {
  listTrash,
  restoreTrashItem,
  deleteTrashItem,
  type TrashItem,
} from "@/features/trash/services/trash.service"

export function useTrash() {
  const { userId, isAuthenticating } = useSession()
  const queryClient = useQueryClient()
  const trashKey = ["trash", userId]
  const supabase = createClient()

  const query = useQuery<TrashItem[]>({
    queryKey: trashKey,
    queryFn: () => listTrash(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })

  const restoreMutation = useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: TrashItem["kind"] }) =>
      restoreTrashItem(supabase, userId!, id, kind),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: trashKey })
      const previousTrash = queryClient.getQueryData<TrashItem[]>(trashKey)
      queryClient.setQueryData<TrashItem[]>(trashKey, (prev) =>
        prev?.filter((item) => item.id !== id) ?? []
      )
      return { previousTrash }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTrash) {
        queryClient.setQueryData(trashKey, context.previousTrash)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: trashKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: TrashItem["kind"] }) =>
      deleteTrashItem(supabase, userId!, id, kind),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: trashKey })
      const previousTrash = queryClient.getQueryData<TrashItem[]>(trashKey)
      queryClient.setQueryData<TrashItem[]>(trashKey, (prev) =>
        prev?.filter((item) => item.id !== id) ?? []
      )
      return { previousTrash }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTrash) {
        queryClient.setQueryData(trashKey, context.previousTrash)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: trashKey })
    },
  })

  const restoreAllMutation = useMutation({
    mutationFn: (items: TrashItem[]) =>
      Promise.all(
        items.map((item) =>
          restoreTrashItem(supabase, userId!, item.id, item.kind)
        )
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: trashKey })
      const previousTrash = queryClient.getQueryData<TrashItem[]>(trashKey)
      queryClient.setQueryData<TrashItem[]>(trashKey, () => [])
      return { previousTrash }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTrash) {
        queryClient.setQueryData(trashKey, context.previousTrash)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: trashKey })
    },
  })

  return {
    ...query,
    isLoading: query.isLoading || isAuthenticating,
    restore: (id: string, kind: TrashItem["kind"]) =>
      restoreMutation.mutateAsync({ id, kind }),
    restoreAll: (items: TrashItem[]) => restoreAllMutation.mutateAsync(items),
    deleteForever: (id: string, kind: TrashItem["kind"]) =>
      deleteMutation.mutateAsync({ id, kind }),
    isMutating:
      restoreMutation.isPending ||
      deleteMutation.isPending ||
      restoreAllMutation.isPending,
  }
}

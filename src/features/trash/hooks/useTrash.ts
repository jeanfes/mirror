"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"
import {
    listTrash,
    restoreTrashItem,
    deleteTrashItem,
    type TrashItem
} from "@/features/trash/services/trash.service"

export function useTrash() {
    const queryClient = useQueryClient()
    const userId = useUserId()
    const trashKey = userId ? makeQueryKey("trash", userId) : ["trash"]

    const query = useQuery<TrashItem[]>({
        queryKey: trashKey,
        queryFn: listTrash,
        staleTime: 120_000,
        gcTime: 900_000,
        refetchOnWindowFocus: false,
        enabled: !!userId
    })

    const restoreMutation = useMutation<{ id: string; kind: "profile" | "comment" }, Error, string>({
        mutationFn: (id: string) => restoreTrashItem(id),
        onSuccess: (result) => {
            queryClient.setQueryData<TrashItem[]>(trashKey, (prev) =>
                prev?.filter((item) => item.id !== result.id) ?? []
            )
        }
    })

    const deleteMutation = useMutation<{ id: string; kind: "profile" | "comment" }, Error, string>({
        mutationFn: (id: string) => deleteTrashItem(id),
        onSuccess: (result) => {
            queryClient.setQueryData<TrashItem[]>(trashKey, (prev) =>
                prev?.filter((item) => item.id !== result.id) ?? []
            )
        }
    })

    return {
        ...query,
        restore: restoreMutation.mutateAsync,
        deleteForever: deleteMutation.mutateAsync,
        isMutating: restoreMutation.isPending || deleteMutation.isPending
    }
}

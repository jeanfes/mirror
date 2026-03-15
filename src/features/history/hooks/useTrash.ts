"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    listTrash,
    restoreTrashItem,
    deleteTrashItem,
    type TrashItem,
} from "@/features/history/services/trash.local.service"

const trashKey = ["trash"] as const

export function useTrash() {
    const queryClient = useQueryClient()

    const query = useQuery<TrashItem[]>({
        queryKey: trashKey,
        queryFn: listTrash,
        staleTime: 120_000,
        gcTime: 900_000,
        refetchOnWindowFocus: false
    })

    const restoreMutation = useMutation<TrashItem[], Error, string>({
        mutationFn: (id: string) => restoreTrashItem(id),
        onSuccess: (next) => {
            queryClient.setQueryData<TrashItem[]>(trashKey, next)
        }
    })

    const deleteMutation = useMutation<TrashItem[], Error, string>({
        mutationFn: (id: string) => deleteTrashItem(id),
        onSuccess: (next) => {
            queryClient.setQueryData<TrashItem[]>(trashKey, next)
        }
    })

    return {
        ...query,
        restore: restoreMutation.mutateAsync,
        deleteForever: deleteMutation.mutateAsync,
        isMutating: restoreMutation.isPending || deleteMutation.isPending
    }
}

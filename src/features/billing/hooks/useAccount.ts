"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"
import { getAccount, setPlan, type PlanName } from "@/features/billing/services/billing.service"

export function useAccount() {
  const queryClient = useQueryClient()
  const userId = useUserId()
  const accountKey = userId ? makeQueryKey("account", userId) : ["account"]

  const query = useQuery({
    queryKey: accountKey,
    queryFn: getAccount,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const mutation = useMutation({
    mutationFn: (plan: PlanName) => setPlan(plan),
    onSuccess: (next) => {
      queryClient.setQueryData(accountKey, next)
    }
  })

  return {
    ...query,
    setPlan: mutation.mutateAsync,
    isMutating: mutation.isPending,
    // Backward-compatible alias while pages migrate to isMutating.
    isUpdatingPlan: mutation.isPending
  }
}

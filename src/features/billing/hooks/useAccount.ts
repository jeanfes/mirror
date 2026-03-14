"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAccount, setPlan, type PlanName } from "@/features/billing/services/billing.local.service"

const accountKey = ["account"]

export function useAccount() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: accountKey,
    queryFn: getAccount,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false
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
    isUpdatingPlan: mutation.isPending
  }
}

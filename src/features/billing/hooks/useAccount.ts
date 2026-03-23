"use client"

import { getAccount, setPlan, type PlanName } from "@/features/billing/services/billing.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/lib/supabase/useSession"
import { createClient } from "@/lib/supabase/client"

export function useAccount() {
  const queryClient = useQueryClient()
const supabase = createClient()
  const { userId, isAuthenticating } = useSession()
  const accountKey = ["account", userId]

  const query = useQuery({
    queryKey: accountKey,
    queryFn: () => getAccount(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const mutation = useMutation({
    mutationFn: (plan: PlanName) => setPlan(supabase, userId!, plan),
    onSuccess: (next) => {
      queryClient.setQueryData(accountKey, next)
    }
  })

  return {
    ...query,
    isLoading: query.isLoading || isAuthenticating,
    setPlan: mutation.mutateAsync,
    isMutating: mutation.isPending,
    isUpdatingPlan: mutation.isPending
  }

}


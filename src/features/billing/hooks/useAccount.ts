"use client"

import { getAccount, startCheckout, type PlanName } from "@/features/billing/services/billing.service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useSession } from "@/lib/supabase/useSession"
import { createClient } from "@/lib/supabase/client"

export function useAccount() {
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
    mutationFn: (plan: PlanName) => startCheckout(supabase, plan),
  })

  return {
    ...query,
    isLoading: query.isLoading || isAuthenticating,
    startCheckout: mutation.mutateAsync,
    isMutating: mutation.isPending,
    isUpdatingPlan: mutation.isPending
  }

}


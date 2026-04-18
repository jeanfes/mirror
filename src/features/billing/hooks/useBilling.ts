"use client"

import {
  cancelSubscription,
  getBillingInfo,
  getInvoices,
} from "@/features/billing/services/billing.service"
import { useSession } from "@/lib/supabase/useSession"
import { createClient } from "@/lib/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { UserAccount } from "@/types/database.types"

export function useBilling(options?: { enabled?: boolean }) {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const { userId, isAuthenticating } = useSession()
  const isEnabled = options?.enabled !== false && !!userId
  
  const invoicesKey = ["invoices", userId]
  const billingInfoKey = ["billingInfo", userId]

  const invoicesQuery = useQuery({
    queryKey: invoicesKey,
    queryFn: () => getInvoices(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: isEnabled
  })

  const billingInfoQuery = useQuery({
    queryKey: billingInfoKey,
    queryFn: () => getBillingInfo(supabase),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: isEnabled
  })

  const cancelSubscriptionMutation = useMutation({
    mutationFn: () => cancelSubscription(supabase),
    onMutate: async () => {
      // Optimistic upate
      await queryClient.cancelQueries({ queryKey: ["account", userId] })
      const previousAccount = queryClient.getQueryData(["account", userId])
      queryClient.setQueryData(["account", userId], (old: UserAccount | undefined) => {
        if (!old) return old
        return {
          ...old,
          subscriptionStatus: "canceled"
        }
      })
      return { previousAccount }
    },
    onError: (err, variables, context) => {
      if (context?.previousAccount) {
        queryClient.setQueryData(["account", userId], context.previousAccount)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: billingInfoKey })
    }
  })

  return {
    invoices: invoicesQuery.data ?? [],
    isLoadingInvoices: invoicesQuery.isPending || (invoicesQuery.isFetching && !invoicesQuery.data) || isAuthenticating,
    isErrorInvoices: invoicesQuery.isError,
    paymentMethods: billingInfoQuery.data?.paymentMethod ? [billingInfoQuery.data.paymentMethod] : [],
    billingInfo: billingInfoQuery.data,
    isLoadingSettings: billingInfoQuery.isPending || (billingInfoQuery.isFetching && !billingInfoQuery.data) || isAuthenticating,
    isErrorSettings: billingInfoQuery.isError,
    refetchInvoices: invoicesQuery.refetch,
    refetchBillingInfo: billingInfoQuery.refetch,
    cancelSubscription: cancelSubscriptionMutation.mutateAsync,
    isCancellingSubscription: cancelSubscriptionMutation.isPending
  }

}

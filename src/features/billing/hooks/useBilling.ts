"use client"

import {
  cancelSubscription,
  getBillingInfo,
  getCreditTransactions,
  getInvoices,
  getPlanChangeHistory,
  getAccountStats,
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
  const creditTransactionsKey = ["creditTransactions", userId]
  const planChangeHistoryKey = ["planChangeHistory", userId]
  const accountStatsKey = ["accountStats", userId]

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

  const creditTransactionsQuery = useQuery({
    queryKey: creditTransactionsKey,
    queryFn: () => getCreditTransactions(supabase, userId!, 100),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: isEnabled,
  })

  const planChangeHistoryQuery = useQuery({
    queryKey: planChangeHistoryKey,
    queryFn: () => getPlanChangeHistory(supabase, userId!, 50),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: isEnabled,
  })

  const accountStatsQuery = useQuery({
    queryKey: accountStatsKey,
    queryFn: () => getAccountStats(supabase, userId!),
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: isEnabled,
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
    creditTransactions: creditTransactionsQuery.data ?? [],
    isLoadingCreditTransactions:
      creditTransactionsQuery.isPending ||
      (creditTransactionsQuery.isFetching && !creditTransactionsQuery.data) ||
      isAuthenticating,
    isErrorCreditTransactions: creditTransactionsQuery.isError,
    planChangeHistory: planChangeHistoryQuery.data ?? [],
    isLoadingPlanChangeHistory:
      planChangeHistoryQuery.isPending ||
      (planChangeHistoryQuery.isFetching && !planChangeHistoryQuery.data) ||
      isAuthenticating,
    isErrorPlanChangeHistory: planChangeHistoryQuery.isError,
    accountStats: accountStatsQuery.data ?? null,
    isLoadingAccountStats:
      accountStatsQuery.isPending ||
      (accountStatsQuery.isFetching && !accountStatsQuery.data) ||
      isAuthenticating,
    isErrorAccountStats: accountStatsQuery.isError,
    paymentMethods: billingInfoQuery.data?.paymentMethod ? [billingInfoQuery.data.paymentMethod] : [],
    billingInfo: billingInfoQuery.data,
    isLoadingSettings: billingInfoQuery.isPending || (billingInfoQuery.isFetching && !billingInfoQuery.data) || isAuthenticating,
    isErrorSettings: billingInfoQuery.isError,
    refetchInvoices: invoicesQuery.refetch,
    refetchCreditTransactions: creditTransactionsQuery.refetch,
    refetchPlanChangeHistory: planChangeHistoryQuery.refetch,
    refetchAccountStats: accountStatsQuery.refetch,
    refetchBillingInfo: billingInfoQuery.refetch,
    cancelSubscription: cancelSubscriptionMutation.mutateAsync,
    isCancellingSubscription: cancelSubscriptionMutation.isPending
  }

}

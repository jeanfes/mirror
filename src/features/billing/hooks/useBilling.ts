"use client"

import { useQuery } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"
import { getInvoices, getBillingInfo } from "@/features/billing/services/billing.service"

export function useBilling() {
  const { userId, isAuthenticating } = useUserId()
  const invoicesKey = userId ? makeQueryKey("invoices", userId) : ["invoices"]
  const billingInfoKey = userId ? makeQueryKey("billingInfo", userId) : ["billingInfo"]

  const invoicesQuery = useQuery({
    queryKey: invoicesKey,
    queryFn: getInvoices,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const billingInfoQuery = useQuery({
    queryKey: billingInfoKey,
    queryFn: getBillingInfo,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  return {
    invoices: invoicesQuery.data ?? [],
    isLoadingInvoices: invoicesQuery.isPending || isAuthenticating,
    isErrorInvoices: invoicesQuery.isError,
    paymentMethods: billingInfoQuery.data?.paymentMethod ? [billingInfoQuery.data.paymentMethod] : [],
    billingInfo: billingInfoQuery.data,
    isLoadingSettings: billingInfoQuery.isPending || isAuthenticating,
    isErrorSettings: billingInfoQuery.isError,
    refetchInvoices: invoicesQuery.refetch,
    refetchBillingInfo: billingInfoQuery.refetch
  }

}

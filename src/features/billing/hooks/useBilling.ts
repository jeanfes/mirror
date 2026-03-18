"use client"

import { useQuery } from "@tanstack/react-query"
import { makeQueryKey, useUserId } from "@/lib/react-query-helpers"
import { getInvoices, getPaymentMethods } from "@/features/billing/services/billing.service"

export function useBilling() {
  const userId = useUserId()
  const invoicesKey = userId ? makeQueryKey("invoices", userId) : ["invoices"]
  const paymentMethodsKey = userId ? makeQueryKey("paymentMethods", userId) : ["paymentMethods"]

  const invoicesQuery = useQuery({
    queryKey: invoicesKey,
    queryFn: getInvoices,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  const paymentMethodsQuery = useQuery({
    queryKey: paymentMethodsKey,
    queryFn: getPaymentMethods,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })

  return {
    invoices: invoicesQuery.data ?? [],
    isLoadingInvoices: invoicesQuery.isLoading,
    isErrorInvoices: invoicesQuery.isError,
    paymentMethods: paymentMethodsQuery.data ?? [],
    isLoadingPaymentMethods: paymentMethodsQuery.isLoading,
    isErrorPaymentMethods: paymentMethodsQuery.isError,
    refetchInvoices: invoicesQuery.refetch,
    refetchPaymentMethods: paymentMethodsQuery.refetch
  }
}

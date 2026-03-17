"use client"

import { useQuery } from "@tanstack/react-query"
import { getInvoices, getPaymentMethods } from "@/features/billing/services/billing.local.service"

const invoicesKey = ["invoices"]
const paymentMethodsKey = ["paymentMethods"]

export function useBilling() {
  const invoicesQuery = useQuery({
    queryKey: invoicesKey,
    queryFn: getInvoices,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false
  })

  const paymentMethodsQuery = useQuery({
    queryKey: paymentMethodsKey,
    queryFn: getPaymentMethods,
    staleTime: 120_000,
    gcTime: 900_000,
    refetchOnWindowFocus: false
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

"use client"

import { getInvoices, getBillingInfo } from "@/features/billing/services/billing.service"
import { useSession } from "@/lib/supabase/useSession"
import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"

export function useBilling(options?: { enabled?: boolean }) {
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

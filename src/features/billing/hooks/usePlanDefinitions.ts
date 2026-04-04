"use client"

import { createClient } from "@/lib/supabase/client"
import {
  getPlanDefinitions,
  planDefinitions,
  type PlanDefinition,
} from "@/features/billing/services/billing.service"
import { useQuery } from "@tanstack/react-query"

export function usePlanDefinitions() {
  const supabase = createClient()

  return useQuery<PlanDefinition[]>({
    queryKey: ["plan-definitions"],
    queryFn: async () => {
      try {
        return await getPlanDefinitions(supabase)
      } catch {
        return planDefinitions
      }
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: false,
  })
}

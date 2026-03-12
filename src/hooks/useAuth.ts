"use client"

import { useAuthState } from "@/features/auth/hooks/useAuthState"

export function useAuth() {
  return useAuthState()
}

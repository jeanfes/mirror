"use client"

import { useUserStore } from "@/store/useUserStore"


export function useSession() {
  const user = useUserStore((state) => state.user)
  const isInitialized = useUserStore((state) => state.isInitialized)

  return {
    userId: user?.id,
    user,
    isAuthenticated: !!user,
    isAuthenticating: !isInitialized,
  }
}

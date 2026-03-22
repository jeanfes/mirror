"use client"

import { useUserStore } from "@/store/useUserStore"

/**
 * Provides the current authenticated session state.
 * Uses the client-side store to avoid redundant Supabase auth.getUser() calls.
 */
export function useSession() {
  const user = useUserStore((state) => state.user)
  
  return {
    userId: user?.id,
    user,
    isAuthenticated: !!user,
    // We assume it's authenticating if there's no user in store but we don't know for sure yet.
    // In a real app, you'd have a separate 'isInitialLoading' flag in the store.
    isAuthenticating: !user 
  }
}

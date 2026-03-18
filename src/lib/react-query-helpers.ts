"use client"

import { useEffect, useState } from "react"
import { getAuthContext } from "@/lib/supabase/auth-context"

/**
 * Create a scoped query key for per-user cache isolation
 * Prevents cache cross-contamination between different users in same browser
 * @param key Base query key string
 * @param userId User identifier to scope the key
 * @returns Scoped query key tuple
 */
export function makeQueryKey(key: string, userId: string): (string | undefined)[] {
  return [key, userId]
}

/**
 * Hook to get current user ID for query key scoping
 * Returns undefined until user is authenticated
 */
export function useUserId(): string | undefined {
  const [userId, setUserId] = useState<string | undefined>(undefined)

  useEffect(() => {
    let mounted = true
    getAuthContext()
      .then(({ userId }) => {
        if (mounted) {
          setUserId(userId)
        }
      })
      .catch(() => {
        if (mounted) {
          setUserId(undefined)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return userId
}

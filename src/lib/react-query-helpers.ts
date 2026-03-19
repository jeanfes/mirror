"use client"

import { useEffect, useState } from "react"
import { getAuthContext } from "@/lib/supabase/auth-context"


export function makeQueryKey(key: string, userId: string): (string | undefined)[] {
  return [key, userId]
}


export function useUserId(): { userId: string | undefined; isAuthenticating: boolean } {
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  useEffect(() => {
    let mounted = true
    getAuthContext()
      .then(({ userId }) => {
        if (mounted) {
          setUserId(userId)
          setIsAuthenticating(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setUserId(undefined)
          setIsAuthenticating(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { userId, isAuthenticating }
}



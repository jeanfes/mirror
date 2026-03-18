"use client"

import { useEffect, useState } from "react"
import { getAuthContext } from "@/lib/supabase/auth-context"


export function makeQueryKey(key: string, userId: string): (string | undefined)[] {
  return [key, userId]
}


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


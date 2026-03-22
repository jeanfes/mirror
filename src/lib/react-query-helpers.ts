import { useEffect, useState } from "react"
import { getAuthContext } from "@/lib/supabase/auth-context"
import { useUserStore } from "@/store/useUserStore"

export function makeQueryKey(key: string, userId: string): (string | undefined)[] {
  return [key, userId]
}

export function useUserId(): { userId: string | undefined; isAuthenticating: boolean } {
  const storeUser = useUserStore((state) => state.user)
  const [networkUserId, setNetworkUserId] = useState<string | undefined>(undefined)
  const [isNetworkAuth, setIsNetworkAuth] = useState(true)

  const userId = storeUser?.id ?? networkUserId
  const isAuthenticating = storeUser ? false : isNetworkAuth

  useEffect(() => {
    if (storeUser) return

    let mounted = true
    getAuthContext()
      .then(({ userId }) => {
        if (mounted) {
          setNetworkUserId(userId)
          setIsNetworkAuth(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setNetworkUserId(undefined)
          setIsNetworkAuth(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [storeUser])

  return { userId, isAuthenticating }
}



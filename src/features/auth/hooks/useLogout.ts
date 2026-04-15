"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { ROUTES } from "@/lib/routes"
import { signOut } from "@/features/auth/services/auth.service"
import { notifyExtensionSignedOut } from "@/lib/extension-bridge"
import { clearAuthContext } from "@/lib/supabase/auth-context"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useUserStore } from "@/store/useUserStore"

export const useLogout = () => {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useLanguageStore()

  const logout = useCallback(async () => {
    setIsPending(true)

    try {
      const { error } = await signOut()

      if (error) {
        toast.error(t.app.common.sessionCloseError)
        return
      }

      clearAuthContext()
      useUserStore.getState().clearUser()
      queryClient.clear()
      void notifyExtensionSignedOut()

      toast.success(t.app.common.sessionClosed)
      router.refresh()
      router.replace(ROUTES.auth.login)
    } catch {
      toast.error(t.app.common.sessionCloseError)
    } finally {
      setIsPending(false)
    }
  }, [queryClient, router, t.app.common.sessionCloseError, t.app.common.sessionClosed])

  return { logout, isPending }
}

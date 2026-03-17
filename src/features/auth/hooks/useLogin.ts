"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/routes"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { LoginValues } from "../schemas"
import { mapLoginError, mapOAuthStartError, type LoginError } from "../errors"

export const useLogin = () => {
    const [isPending, setIsPending] = useState(false)
    const [isPendingGoogle, setIsPendingGoogle] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()
    const authErrors = useLanguageStore((state) => state.t.auth.errors)

    const login = useCallback(async (data: LoginValues): Promise<LoginError | null> => {
        setIsPending(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) {
                setIsPending(false)
                return mapLoginError(error)
            }

            setIsPending(false)
            setIsNavigating(true)
            router.push(DEFAULT_AUTHENTICATED_ROUTE)
            router.refresh()
            return null
        } catch {
            setIsPending(false)
            return "connection_error"
        }
    }, [router])

    const loginWithGoogle = useCallback(async () => {
        setIsPendingGoogle(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}${ROUTES.auth.callback}` },
            })

            if (error) {
                const mappedError = mapOAuthStartError(error)
                if (mappedError === "rate_limit") {
                    toast.error(authErrors.authRateLimit)
                } else if (mappedError === "auth_unavailable") {
                    toast.error(authErrors.authUnavailable)
                } else {
                    toast.error(authErrors.oauthStartError)
                }

                setIsPendingGoogle(false)
            }
        } catch {
            toast.error(authErrors.connectionError)
            setIsPendingGoogle(false)
        }
    }, [authErrors])

    return { login, loginWithGoogle, isPending, isPendingGoogle, isNavigating }
}

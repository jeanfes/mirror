"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/routes"
import { signInWithGoogle, signInWithPassword } from "@/features/auth/services/auth.service"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { LoginValues } from "../schemas"
import { mapLoginError, mapOAuthStartError, type LoginError } from "../errors"

export const useLogin = () => {
    const [isPending, setIsPending] = useState(false)
    const [isPendingGoogle, setIsPendingGoogle] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const nextParam = searchParams.get("next")
    const authErrors = useLanguageStore((state) => state.t.auth.errors)

    const login = useCallback(async (data: LoginValues): Promise<LoginError | null> => {
        setIsPending(true)
        try {
            const { error } = await signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) {
                setIsPending(false)
                return mapLoginError(error)
            }

            // Sync theme and language to cookies instantly to prevent FOUC on initial redirect
            try {
                const { createClient } = await import("@/lib/supabase/client")
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                
                if (user) {
                    const { data: settings } = await supabase
                        .from("user_settings")
                        .select("theme, language")
                        .eq("user_id", user.id)
                        .single()
                        
                    if (settings) {
                        const themePreference = settings.theme === "auto" ? "system" : settings.theme

                        if (themePreference) {
                            document.cookie = `mirror-theme-preference=${themePreference}; path=/; max-age=31536000; SameSite=Lax`
                        }
                        if (settings.language) {
                            document.cookie = `NEXT_LOCALE=${settings.language}; path=/; max-age=31536000; SameSite=Lax`
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to sync preferences before redirect", err)
            }

            setIsPending(false)
            setIsNavigating(true)
            
            if (nextParam && nextParam.startsWith("chrome-extension://")) {
                router.push(`${ROUTES.auth.login.replace("/login", "/extension-redirect")}?next=${encodeURIComponent(nextParam)}`)
            } else {
                router.push(nextParam || DEFAULT_AUTHENTICATED_ROUTE)
            }
            
            router.refresh()
            return null
        } catch {
            setIsPending(false)
            return "connection_error"
        }
    }, [router, nextParam])

    const loginWithGoogle = useCallback(async () => {
        setIsPendingGoogle(true)
        try {
            const callbackUrl = new URL(`${window.location.origin}${ROUTES.auth.callback}`)
            if (nextParam) {
                callbackUrl.searchParams.set("next", nextParam)
            }
            const { error } = await signInWithGoogle(callbackUrl.toString())

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
    }, [authErrors, nextParam])

    return { login, loginWithGoogle, isPending, isPendingGoogle, isNavigating }
}

"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/routes"
import type { LoginValues } from "../schemas"

export type LoginError = "invalid_credentials" | "connection_error"

export const useLogin = () => {
    const [isPending, setIsPending] = useState(false)
    const [isPendingGoogle, setIsPendingGoogle] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()

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
                return "invalid_credentials"
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
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}${ROUTES.auth.callback}` },
            })
        } catch {
            toast.error("Could not start Google sign-in")
            setIsPendingGoogle(false)
        }
    }, [])

    return { login, loginWithGoogle, isPending, isPendingGoogle, isNavigating }
}

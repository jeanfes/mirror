"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from "@/lib/routes"
import type { LoginValues, RegisterValues } from "../schemas"

export type LoginError = "invalid_credentials" | "connection_error"
export type RegisterError = "email_taken" | "register_error" | "connection_error"

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

export const useRegister = () => {
    const [isPending, setIsPending] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()

    const register = useCallback(async (data: RegisterValues): Promise<RegisterError | null> => {
        setIsPending(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: { data: { name: data.name } },
            })

            if (error) {
                setIsPending(false)
                if (error.message === "User already registered") return "email_taken"
                return "register_error"
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

    return { register, isPending, isNavigating }
}

export const useLogout = () => {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const logout = useCallback(async () => {
        setIsPending(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signOut()

            if (error) {
                toast.error("Could not close your session")
                return
            }

            toast.success("Session closed")
            router.replace(ROUTES.auth.login)
            router.refresh()
        } catch {
            toast.error("Could not close your session")
        } finally {
            setIsPending(false)
        }
    }, [router])

    return { logout, isPending }
}

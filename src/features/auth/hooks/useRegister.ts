"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/lib/routes"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { RegisterValues } from "../schemas"

export type RegisterError = "email_taken" | "register_error" | "connection_error"

export const useRegister = () => {
    const [isPending, setIsPending] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()
    const registerSuccessMessage = useLanguageStore((state) => state.t.auth.registerSuccess)

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
            toast.success(registerSuccessMessage)
            router.push(DEFAULT_AUTHENTICATED_ROUTE)
            router.refresh()
            return null
        } catch {
            setIsPending(false)
            return "connection_error"
        }
    }, [registerSuccessMessage, router])

    return { register, isPending, isNavigating }
}

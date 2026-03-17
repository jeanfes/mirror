"use client"

import { useCallback, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/routes"
import type { ForgotPasswordValues, ResetPasswordValues } from "../schemas"
import { mapRecoveryError, mapResetPasswordError, type RecoveryError, type ResetPasswordError } from "../errors"

export const useRecovery = () => {
    const [isPending, setIsPending] = useState(false)

    const sendRecoveryEmail = useCallback(async (data: ForgotPasswordValues): Promise<RecoveryError | null> => {
        setIsPending(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}${ROUTES.auth.resetPassword}`,
            })

            if (error) {
                setIsPending(false)
                return mapRecoveryError(error)
            }

            setIsPending(false)
            return null
        } catch {
            setIsPending(false)
            return "connection_error"
        }
    }, [])

    const resetPassword = useCallback(async (data: ResetPasswordValues): Promise<ResetPasswordError | null> => {
        setIsPending(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            })

            if (error) {
                setIsPending(false)
                return mapResetPasswordError(error)
            }

            setIsPending(false)
            return null
        } catch {
            setIsPending(false)
            return "connection_error"
        }
    }, [])

    return { sendRecoveryEmail, resetPassword, isPending }
}

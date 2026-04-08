"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES, normalizeExtensionNext, normalizeSafeInternalRoute } from "@/lib/routes"
import { signUpWithPassword } from "@/features/auth/services/auth.service"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { RegisterValues } from "../schemas"
import { mapRegisterError, type RegisterError } from "../errors"

export const useRegister = () => {
    const [isPending, setIsPending] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const nextParam = searchParams.get("next")
    const extensionNext = normalizeExtensionNext(nextParam)
    const internalNext = normalizeSafeInternalRoute(nextParam)
    const extensionRedirectTarget = extensionNext
        ? `${ROUTES.auth.extensionRedirect}?next=${encodeURIComponent(extensionNext)}`
        : null
    const registerSuccessMessage = useLanguageStore((state) => state.t.auth.registerSuccess)

    const register = useCallback(async (data: RegisterValues): Promise<RegisterError | null> => {
        setIsPending(true)
        try {
            const { error } = await signUpWithPassword({
                email: data.email,
                password: data.password,
                name: data.name
            })

            if (error) {
                setIsPending(false)
                return mapRegisterError(error)
            }

            setIsPending(false)
            setIsNavigating(true)
            toast.success(registerSuccessMessage)
            
            if (extensionRedirectTarget) {
                router.push(extensionRedirectTarget)
            } else {
                router.push(internalNext || DEFAULT_AUTHENTICATED_ROUTE)
            }
            
            router.refresh()
            return null
        } catch {
            setIsPending(false)
            return "connection_error"
        }
    }, [registerSuccessMessage, router, extensionRedirectTarget, internalNext])

    return { register, isPending, isNavigating }
}

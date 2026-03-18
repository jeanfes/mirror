"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { ROUTES } from "@/lib/routes"
import { signOut } from "@/features/auth/services/auth.service"

export const useLogout = () => {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    const logout = useCallback(async () => {
        setIsPending(true)

        try {
            const { error } = await signOut()

            if (error) {
                toast.error("Could not close your session")
                return
            }

            await queryClient.clear()
            toast.success("Session closed")
            router.replace(ROUTES.auth.login)
            router.refresh()
        } catch {
            toast.error("Could not close your session")
        } finally {
            setIsPending(false)
        }
    }, [queryClient, router])

    return { logout, isPending }
}

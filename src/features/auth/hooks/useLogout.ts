"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/routes"

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

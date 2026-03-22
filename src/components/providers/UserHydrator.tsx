"use client"

import { useUserStore } from "@/store/useUserStore"
import { useEffect } from "react"

interface User {
    id: string
    email?: string
    name?: string
    avatar?: string
}

export function UserHydrator({ user }: { user: User }) {
    const setUser = useUserStore((state) => state.setUser)
    const initialized = useUserStore((state) => state.user?.id === user.id)

    if (!initialized) {
        useUserStore.setState({ user })
    }

    return null
}

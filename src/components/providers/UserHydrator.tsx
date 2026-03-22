"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/useUserStore"

interface User {
    id: string
    email?: string
    name?: string
    avatar?: string
}

export function UserHydrator({ user }: { user: User }) {
    const setUser = useUserStore((state) => state.setUser)

    useState(() => {
        useUserStore.setState({ user })
        return true
    })

    useEffect(() => {
        setUser(user)
    }, [user, setUser])

    return null
}

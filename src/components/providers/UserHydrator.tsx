"use client"

import { useEffect } from "react"
import { useUserStore } from "@/store/useUserStore"

interface User {
  id: string
  name?: string
  email?: string
  avatar?: string
}

export function UserHydrator({ user }: { user: User }) {
  useEffect(() => {
    const current = useUserStore.getState().user
    if (current?.id !== user.id) {
      useUserStore.getState().setUser(user)
    }
  }, [user])

  return null
}

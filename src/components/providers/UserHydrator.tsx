"use client"

import { useUserStore } from "@/store/useUserStore"


interface User {
  id: string
  name?: string
  email?: string
  avatar?: string
}

export function UserHydrator({ user }: { user: User }) {
  const { user: storeUser } = useUserStore.getState()

  if (storeUser?.id !== user.id) {
    useUserStore.getState().setUser(user)
  }

  return null
}

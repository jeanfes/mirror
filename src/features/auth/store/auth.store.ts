import type { AuthUser } from "@/features/auth/types"
import { create } from "zustand"

type AuthStore = {
  currentUser: AuthUser | null
  setAuthUser: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  setAuthUser: (user) => set({ currentUser: user })
}))

export function setAuthUser(user: AuthUser | null) {
  useAuthStore.getState().setAuthUser(user)
}

export function getAuthUser() {
  return useAuthStore.getState().currentUser
}

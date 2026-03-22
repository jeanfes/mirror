import { create } from "zustand"

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
}

interface UserState {
  user: User | null
  isInitialized: boolean
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user, isInitialized: true }),
  clearUser: () => set({ user: null, isInitialized: true }),
}))

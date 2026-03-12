"use client"

import { useState } from "react"
import type { AuthUser } from "../types"

export function useAuthState() {
  const [user, setUser] = useState<AuthUser | null>(null)
  return { user, setUser }
}

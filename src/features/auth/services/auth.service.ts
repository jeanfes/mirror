import type { AuthUser } from "../types"

export async function signInWithEmail(email: string, password: string): Promise<AuthUser | null> {
  if (email === "demo@mirror.app" && password === "Mirror123!") {
    return { id: "1", name: "Mirror Demo", email }
  }
  return null
}

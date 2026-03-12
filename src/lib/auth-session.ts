import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

function isRecoverableSessionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()

  return (
    normalized.includes("jwt_session_error") ||
    normalized.includes("decryption operation failed") ||
    normalized.includes("jwe") ||
    normalized.includes("jwt")
  )
}

export async function getSafeServerSession() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    if (isRecoverableSessionError(error)) {
      return null
    }

    throw error
  }
}

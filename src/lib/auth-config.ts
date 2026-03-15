import {
  AUTH_PATHS,
  PRIVATE_PATHS,
  isAuthPath,
  isPrivatePath
} from "@/lib/routes"

export { AUTH_PATHS, PRIVATE_PATHS, isAuthPath, isPrivatePath }

function isExplicitlyDisabled(value: string | undefined) {
  return value === "false"
}

function hasPlaceholderSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

  return (
    !url ||
    !key ||
    url.includes("YOUR_PROJECT_ID") ||
    key.includes("YOUR_ANON_KEY")
  )
}

export function isAuthEnabled() {
  if (isExplicitlyDisabled(process.env.AUTH_ENABLED)) {
    return false
  }

  if (isExplicitlyDisabled(process.env.NEXT_PUBLIC_AUTH_ENABLED)) {
    return false
  }

  return true
}

export function isClientMockAuthMode() {
  if (isExplicitlyDisabled(process.env.NEXT_PUBLIC_AUTH_ENABLED)) {
    return true
  }

  return hasPlaceholderSupabaseConfig()
}

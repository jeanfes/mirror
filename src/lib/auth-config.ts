export const PRIVATE_PATHS = [
  "/profiles",
  "/history",
  "/settings",
  "/account",
  "/plans",
  "/trash"
]

export const AUTH_PATHS = ["/login", "/register"]

export function isAuthEnabled() {
  return process.env.AUTH_ENABLED !== "false"
}

export function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))
}

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))
}
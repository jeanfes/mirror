export const PRIVATE_PATHS = [
  "/assistant",
  "/planner",
  "/team",
  "/profiles",
  "/history",
  "/analytics",
  "/settings",
  "/account",
  "/plans",
  "/trash"
]

export function isAuthEnabled() {
  return process.env.AUTH_ENABLED !== "false"
}

export function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))
}
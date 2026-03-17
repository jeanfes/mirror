export const ROUTES = {
  public: {
    index: "/",
    landing: "/landing",
    features: "/features",
    pricing: "/pricing",
    faq: "/faq",
    contact: "/contact"
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    callback: "/auth/callback"
  },
  private: {
    profiles: "/profiles",
    history: "/history",
    settings: "/settings",
    account: "/account",
    plans: "/plans",
    trash: "/trash"
  }
} as const

export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.private.profiles
export const DEFAULT_UNAUTHENTICATED_ROUTE = ROUTES.public.index

export const PRIVATE_PATHS = Object.values(ROUTES.private)
export const AUTH_PATHS = [ROUTES.auth.login, ROUTES.auth.register]
export const KNOWN_APP_PATHS = [
  ROUTES.public.index,
  ...Object.values(ROUTES.public),
  ...AUTH_PATHS,
  ROUTES.auth.callback,
  ...PRIVATE_PATHS
]

function isPathOrChild(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`)
}

export function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => isPathOrChild(pathname, path))
}

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => isPathOrChild(pathname, path))
}

export function isKnownAppPath(pathname: string) {
  return KNOWN_APP_PATHS.some((path) => pathname === path)
}

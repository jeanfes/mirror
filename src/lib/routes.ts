export const ROUTES = {
  public: {
    index: "/",
    landing: "/landing",
    features: "/features",
    pricing: "/pricing",
    faq: "/faq",
    contact: "/contact",
    terms: "/terms",
    privacy: "/privacy"
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    callback: "/auth/callback",
    extensionRedirect: "/auth/extension-redirect"
  },
  private: {
    profiles: "/profiles",
    history: "/history",
    goals: "/goals",
    settings: "/settings",
    account: "/account",
    plans: "/plans",
    trash: "/trash"
  }
} as const

export type Routes = typeof ROUTES

export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.private.profiles

const EXTENSION_PROTOCOL = "chrome-extension:"
const EXTENSION_SYNC_PATH = "/sync.html"
const EXTENSION_LEGACY_POPUP_PATH = "/popup.html"
const EXTENSION_ID_PATTERN = /^[a-p]{32}$/

const PRIVATE_PATHS = Object.values(ROUTES.private)
const AUTH_PATHS = [ROUTES.auth.login, ROUTES.auth.register, ROUTES.auth.forgotPassword, ROUTES.auth.resetPassword]

function isPathOrChild(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`)
}

export function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => isPathOrChild(pathname, path))
}

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => isPathOrChild(pathname, path))
}

export function normalizeExtensionNext(value: string | null | undefined): string | null {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed || trimmed.includes(",") || /\s/.test(trimmed)) return null

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return null
  }

  if (parsed.protocol !== EXTENSION_PROTOCOL) return null
  if (!EXTENSION_ID_PATTERN.test(parsed.hostname)) return null
  if (parsed.username || parsed.password || parsed.port) return null
  if (parsed.pathname !== EXTENSION_SYNC_PATH && parsed.pathname !== EXTENSION_LEGACY_POPUP_PATH) {
    return null
  }

  return `chrome-extension://${parsed.hostname}${EXTENSION_SYNC_PATH}`
}

export function normalizeSafeInternalRoute(value: string | null | undefined): string | null {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed.startsWith("/")) return null
  if (trimmed.startsWith("//")) return null

  return trimmed
}

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
    onboardingProfessional: "/onboarding/professional",
    profiles: "/profiles",
    history: "/history",
    goals: "/goals",
    settings: "/settings",
    terms: "/settings/terms",
    privacy: "/settings/privacy",
    account: "/account",
    plans: "/plans",
    trash: "/trash"
  }
} as const

export type Routes = typeof ROUTES

export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.private.profiles

const PUBLIC_PATHS = Object.values(ROUTES.public)
const PRIVATE_PATHS = Object.values(ROUTES.private)
const AUTH_PATHS = [ROUTES.auth.login, ROUTES.auth.register, ROUTES.auth.forgotPassword, ROUTES.auth.resetPassword]

function isPathOrChild(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`)
}

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => isPathOrChild(pathname, path))
}

export function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => isPathOrChild(pathname, path))
}

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => isPathOrChild(pathname, path))
}

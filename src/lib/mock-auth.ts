export interface MockUser {
  id: string
  email: string
  name?: string
}

export const MOCK_AUTH_COOKIE = "mock-auth-session"

const MOCK_CREDENTIALS = [
  { email: "test@local", password: "test12345", name: "Test User" },
  { email: "demo@local", password: "demo12345", name: "Demo User" }
] as const

function getCookieValue(name: string, cookieSource: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = cookieSource.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`))
  return match?.[1] ?? null
}

export function validateMockCredentials(email: string, password: string): MockUser | null {
  const normalizedEmail = email.trim().toLowerCase()
  const user = MOCK_CREDENTIALS.find(
    (credential) => credential.email === normalizedEmail && credential.password === password
  )

  if (!user) {
    return null
  }

  return {
    id: `mock-${user.email}`,
    email: user.email,
    name: user.name
  }
}

export function createMockUserFromRegisterInput(email: string, name?: string): MockUser {
  const normalizedEmail = email.trim().toLowerCase()
  return {
    id: `mock-${normalizedEmail}`,
    email: normalizedEmail,
    name: (name ?? "").trim() || "Mock User"
  }
}

export function setMockSession(user: MockUser) {
  if (typeof document === "undefined") {
    return
  }

  const encoded = encodeURIComponent(JSON.stringify(user))
  document.cookie = `${MOCK_AUTH_COOKIE}=${encoded}; Path=/; Max-Age=2592000; SameSite=Lax`
}

export function clearMockSession() {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${MOCK_AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function parseMockSessionCookie(cookieValue?: string | null): MockUser | null {
  if (!cookieValue) {
    return null
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue)) as Partial<MockUser>

    if (!parsed || typeof parsed.email !== "string" || typeof parsed.id !== "string") {
      return null
    }

    return {
      id: parsed.id,
      email: parsed.email,
      name: typeof parsed.name === "string" ? parsed.name : undefined
    }
  } catch {
    return null
  }
}

export function getMockSessionFromDocumentCookie() {
  if (typeof document === "undefined") {
    return null
  }

  const rawValue = getCookieValue(MOCK_AUTH_COOKIE, document.cookie)
  return parseMockSessionCookie(rawValue)
}

export function getMockCredentialsHelpText() {
  return "Demo: test@local / test12345 o demo@local / demo12345"
}
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

type StoredUser = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: number
}

const users = new Map<string, StoredUser>()

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derivedKey = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derivedKey}`
}

function verifyPasswordHash(password: string, passwordHash: string) {
  const [salt, key] = passwordHash.split(":")
  if (!salt || !key) {
    return false
  }

  const candidate = scryptSync(password, salt, 64)
  const original = Buffer.from(key, "hex")
  if (candidate.length !== original.length) {
    return false
  }

  return timingSafeEqual(candidate, original)
}

function seedDemoUser() {
  const email = "demo@mirror.app"
  if (users.has(email)) {
    return
  }

  users.set(email, {
    id: crypto.randomUUID(),
    name: "Mirror Demo",
    email,
    passwordHash: hashPassword("Mirror123!"),
    createdAt: Date.now()
  })
}

seedDemoUser()

export function findUserByEmail(email: string) {
  return users.get(email.toLowerCase()) ?? null
}

export function createUser(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase()
  if (users.has(email)) {
    return { ok: false as const, error: "EMAIL_EXISTS" }
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name,
    email,
    passwordHash: hashPassword(input.password),
    createdAt: Date.now()
  }

  users.set(email, user)

  return {
    ok: true as const,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

export function validateUserCredentials(email: string, password: string) {
  const user = findUserByEmail(email)
  if (!user) {
    return null
  }

  const valid = verifyPasswordHash(password, user.passwordHash)
  if (!valid) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  }
}

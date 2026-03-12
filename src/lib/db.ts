type DbUser = { id: string; name: string; email: string }

const users: DbUser[] = [
  { id: "1", name: "Mirror Demo", email: "demo@mirror.app" }
]

export async function listUsers() {
  return users
}

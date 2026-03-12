import { listUsers } from "@/lib/db"

export async function getUsers() {
  return listUsers()
}

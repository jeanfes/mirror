import { NextResponse } from "next/server"
import { z } from "zod"
import { createUser } from "@/lib/user-store"

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 })
  }

  const result = createUser(parsed.data)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 })
  }

  return NextResponse.json({ user: result.user }, { status: 201 })
}

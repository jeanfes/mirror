import { NextResponse } from "next/server"
import { getSafeServerSession } from "@/lib/auth-session"

export async function GET() {
  const session = await getSafeServerSession()

  if (!session?.user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user: session.user })
}

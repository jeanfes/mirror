import { NextResponse } from "next/server"
import { getSafeServerSession } from "@/lib/auth-session"
import { getAccountSource } from "@/lib/server/dashboard-source"

export async function GET() {
  const session = await getSafeServerSession()
  const data = await getAccountSource(session?.user?.id)
  return NextResponse.json(data)
}

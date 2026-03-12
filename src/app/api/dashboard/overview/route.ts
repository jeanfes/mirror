import { NextResponse } from "next/server"
import { getSafeServerSession } from "@/lib/auth-session"
import { getOverviewSource } from "@/lib/server/dashboard-source"

export async function GET() {
  const session = await getSafeServerSession()
  const data = await getOverviewSource(session?.user?.id)
  return NextResponse.json(data)
}

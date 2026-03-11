import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    plans: [
      { name: "Free", price: 0, credits: 120 },
      { name: "Pro", price: 19, credits: 1200 },
      { name: "Elite", price: 59, credits: 4000 }
    ]
  })
}

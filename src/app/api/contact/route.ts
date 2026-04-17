import { NextResponse } from "next/server"
import { contactApiSchema } from "@/features/contact/schemas"
import { createClient } from "@/lib/supabase/server"

const MIN_FILL_TIME_MS = 1200
const CONTACT_SOURCE = "web_contact_form"

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    )
  }

  const parsed = contactApiSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact payload." },
      { status: 400 }
    )
  }

  const { website, startedAt, name, email, subjectKey, message } = parsed.data

  if (website.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 202 })
  }

  if (typeof startedAt === "number" && Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json(
      { error: "Please wait a moment before submitting." },
      { status: 429 }
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject_key: subjectKey,
    message,
    source: CONTACT_SOURCE,
  })

  if (error) {
    console.error("[contact] submit failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })

    return NextResponse.json(
      { error: "Could not submit contact request right now." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

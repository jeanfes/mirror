import type { SupabaseClient } from "@supabase/supabase-js"

export class EdgeFunctionError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "EdgeFunctionError"
    this.status = status
  }
}

export type EdgeFunctionMethod = "GET" | "POST" | "DELETE"

export async function callEdgeFunction<TResponse>(
  supabase: SupabaseClient,
  functionName: string,
  body: unknown = {},
  method: EdgeFunctionMethod = "POST"
): Promise<TResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error("Supabase URL is not configured")
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const accessToken = session?.access_token
  if (!accessToken) {
    throw new Error("Missing session token")
  }

  const shouldSendBody = method !== "GET" && body !== undefined

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(shouldSendBody ? { "Content-Type": "application/json" } : {}),
    },
    ...(shouldSendBody ? { body: JSON.stringify(body) } : {}),
  })

  const raw = await response.text()
  const payload = raw ? (JSON.parse(raw) as TResponse | { error?: string; message?: string }) : ({} as TResponse)

  if (!response.ok) {
    const message =
      (payload as { error?: string; message?: string }).error ||
      (payload as { error?: string; message?: string }).message ||
      `Edge function ${functionName} failed`
    throw new EdgeFunctionError(message, response.status)
  }

  return payload as TResponse
}

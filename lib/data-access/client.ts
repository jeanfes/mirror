const appBaseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export async function appApiGet<T>(pathname: string): Promise<T> {
  const response = await fetch(`${appBaseUrl}${pathname}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}) for ${pathname}`)
  }

  return (await response.json()) as T
}

import { NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"
import { ROUTES } from "@/lib/routes"
import { sanitizeExtensionNext } from "@/lib/extension-handoff"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const rawNextParam = requestUrl.searchParams.get("next")
    const nextParam = sanitizeExtensionNext(rawNextParam)

    if (!nextParam) {
        const loginUrl = new URL(ROUTES.auth.login, request.url)
        if (rawNextParam !== null) {
            loginUrl.searchParams.set("error", "invalid_next")
        }
        return NextResponse.redirect(loginUrl)
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const redirectUrl = new URL(ROUTES.auth.extensionRedirect, request.url)
        redirectUrl.searchParams.set("next", nextParam)
        return NextResponse.redirect(redirectUrl)
    }

    const loginUrl = new URL(ROUTES.auth.login, request.url)
    loginUrl.searchParams.set("next", nextParam)
    
    const response = NextResponse.redirect(loginUrl)
    response.cookies.set("mirror_extension_sync", nextParam, {
        maxAge: 60 * 60,
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        secure: requestUrl.protocol === "https:"
    })
    
    return response
}

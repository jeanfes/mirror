import { NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server"
import { ROUTES } from "@/lib/routes"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const nextParam = requestUrl.searchParams.get("next")

    if (!nextParam || !nextParam.startsWith("chrome-extension://")) {
        return NextResponse.redirect(new URL(ROUTES.auth.login, request.url))
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const redirectUrl = new URL(ROUTES.auth.extensionRedirect, request.url)
        redirectUrl.searchParams.set("next", nextParam)
        return NextResponse.redirect(redirectUrl)
    }

    const loginUrl = new URL(ROUTES.auth.login, request.url)
    if (nextParam) {
        loginUrl.searchParams.set("next", nextParam)
    }
    
    const response = NextResponse.redirect(loginUrl)
    if (nextParam) {
        response.cookies.set("mirror_extension_sync", nextParam, { maxAge: 60 * 60, path: "/", sameSite: "lax" })
    }
    
    return response
}

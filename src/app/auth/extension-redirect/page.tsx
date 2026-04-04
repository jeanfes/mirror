"use client"

import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/routes"
import { useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

const BRIDGE_TIMEOUT_MS = 800
const BRIDGE_RETRY_DELAY_MS = 50
const BRIDGE_ATTEMPTS = 2

type ExtensionSyncResponse = {
    ok?: boolean
}

type ExtensionSetSessionMessage = {
    type: "SET_SESSION"
    token: string
    refreshToken: string
    openOptions: boolean
}

type ExtensionBridgeMessage = ExtensionSetSessionMessage

type ExtensionRuntimeBridge = {
    lastError?: {
        message?: string
    }
    sendMessage: (
        extensionId: string,
        message: ExtensionBridgeMessage,
        callback: (response: ExtensionSyncResponse | undefined) => void
    ) => void
}

type WindowWithExtensionBridge = Window & {
    chrome?: {
        runtime?: ExtensionRuntimeBridge
    }
}

function RedirectContent() {
    const searchParams = useSearchParams()
    const nextUrl = searchParams.get("next")
    const [status, setStatus] = useState("Estableciendo conexión segura...")
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)

    const isFallbackActive = !isSuccess && !isError && Boolean(fallbackUrl)

    const title = isSuccess
        ? "Sincronización completada"
        : isError
            ? "Error de conexión"
            : isFallbackActive
                ? "Abriendo extensión"
                : "Conectando extensión"

    const helperText = isSuccess
        ? "La sesión quedó sincronizada con la extensión."
        : isError
            ? status
            : isFallbackActive
                ? "Si la redirección automática se bloquea, usa el botón para continuar."
                : ""

    useEffect(() => {
        let cancelled = false

        const sendWithRetry = (
            runtime: ExtensionRuntimeBridge,
            extensionId: string,
            message: ExtensionBridgeMessage,
            attempts = BRIDGE_ATTEMPTS,
            timeoutMs = BRIDGE_TIMEOUT_MS
        ): Promise<ExtensionSyncResponse | undefined> => {
            return new Promise((resolve, reject) => {
                const attempt = (remaining: number) => {
                    let settled = false
                    const timeoutId = window.setTimeout(() => {
                        if (settled) return
                        settled = true

                        if (remaining > 1) {
                            window.setTimeout(() => attempt(remaining - 1), BRIDGE_RETRY_DELAY_MS)
                            return
                        }

                        reject(new Error("BRIDGE_TIMEOUT"))
                    }, timeoutMs)

                    try {
                        runtime.sendMessage(extensionId, message, (response) => {
                            if (settled) return
                            settled = true
                            window.clearTimeout(timeoutId)

                            const lastError = runtime.lastError
                            if (lastError?.message) {
                                if (remaining > 1) {
                                    window.setTimeout(() => attempt(remaining - 1), BRIDGE_RETRY_DELAY_MS)
                                    return
                                }

                                reject(new Error(lastError.message))
                                return
                            }

                            resolve(response)
                        })
                    } catch (error) {
                        if (settled) return
                        settled = true
                        window.clearTimeout(timeoutId)

                        if (remaining > 1) {
                            window.setTimeout(() => attempt(remaining - 1), BRIDGE_RETRY_DELAY_MS)
                            return
                        }

                        reject(error instanceof Error ? error : new Error("BRIDGE_SEND_FAILED"))
                    }
                }

                attempt(attempts)
            })
        }

        const createHashFallbackUrl = (baseNextUrl: string, payload: {
            accessToken: string
            refreshToken: string
        }) => {
            return `${baseNextUrl}#access_token=${encodeURIComponent(payload.accessToken)}&refresh_token=${encodeURIComponent(payload.refreshToken)}`
        }

        const fallbackToHash = (url: string, reason: string) => {
            console.warn("[extension-redirect] fallback_to_hash", reason)
            if (cancelled) return

            setFallbackUrl(url)
            setStatus("No pudimos sincronizar por mensaje directo. Abriendo extensión...")

            window.location.href = url
        }

        const redirectToLogin = () => {
            const loginUrl = new URL(ROUTES.auth.login, window.location.origin)
            if (nextUrl) {
                loginUrl.searchParams.set("next", nextUrl)
            }
            window.location.href = loginUrl.toString()
        }

        const proceedToExtension = async () => {
            if (!nextUrl || !nextUrl.startsWith("chrome-extension://")) {
                setStatus("Acceso inválido a la extensión.")
                setIsError(true)
                return
            }

            const extensionId = new URL(nextUrl).hostname
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.access_token && session.user?.id) {
                if (!session.refresh_token) {
                    setStatus("No pudimos validar la sesión completa. Redirigiendo al login...")
                    setIsError(true)
                    window.setTimeout(() => {
                        if (cancelled) return
                        redirectToLogin()
                    }, 1200)
                    return
                }

                const browserWindow = window as WindowWithExtensionBridge

                const finalUrl = createHashFallbackUrl(nextUrl, {
                    accessToken: session.access_token,
                    refreshToken: session.refresh_token
                })

                if (browserWindow.chrome?.runtime?.sendMessage) {
                    try {
                        const runtime = browserWindow.chrome.runtime

                        const message: ExtensionSetSessionMessage = {
                            type: "SET_SESSION",
                            token: session.access_token,
                            refreshToken: session.refresh_token,
                            openOptions: true
                        }

                        setStatus("Transfiriendo credenciales a la extensión...")

                        const response = await sendWithRetry(runtime, extensionId, message)
                        if (response?.ok) {
                            setStatus("Sesión sincronizada correctamente.")
                            setIsSuccess(true)
                        } else {
                            fallbackToHash(finalUrl, "set_session_non_ok")
                        }
                    } catch (err) {
                        fallbackToHash(finalUrl, err instanceof Error ? err.message : "set_session_exception")
                    }
                } else {
                    const fallbackUrl = createHashFallbackUrl(nextUrl, {
                        accessToken: session.access_token,
                        refreshToken: session.refresh_token
                    })
                    fallbackToHash(fallbackUrl, "runtime_unavailable")
                }
            } else {
                setStatus("Sesión expirada. Redirigiendo al login...")
                setTimeout(() => {
                    if (cancelled) return
                    redirectToLogin()
                }, 1500)
            }
        }

        void proceedToExtension()

        return () => {
            cancelled = true
        }
    }, [nextUrl])

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg-main p-6 overflow-hidden">

            {/* Background decorations for a subtle premium feel */}
            <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-b from-primary-light/5 dark:from-white/5 to-transparent pointer-events-none" />

            {/* Main Box */}
            <div className="w-full max-w-100 flex flex-col items-center text-center bg-surface-elevated border border-border-soft rounded-4xl p-10 shadow-premium-md relative z-10 transition-all duration-300">

                {/* Icon Container */}
                <div className="mb-8 relative flex items-center justify-center">
                    {isSuccess ? (
                        <div className="size-16 rounded-full bg-success-soft-bg dark:bg-success/10 border border-success-soft-border dark:border-success/20 text-success flex items-center justify-center animate-premium-fade shadow-premium-sm">
                            <ShieldCheck className="size-7" strokeWidth={2.5} />
                        </div>
                    ) : isError ? (
                        <div className="size-16 rounded-full bg-danger-soft-bg border border-danger-soft-border text-danger flex items-center justify-center animate-premium-fade shadow-premium-sm transition-colors duration-300">
                            <AlertCircle className="size-7" strokeWidth={2.5} />
                        </div>
                    ) : (
                        <div className="size-16 rounded-full bg-surface-subtle border border-border-soft text-primary-text flex items-center justify-center shadow-premium-sm transition-colors duration-300">
                            <Loader2 className="size-6 text-primary-dark animate-spin opacity-80" strokeWidth={2.5} />
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="space-y-6 w-full">
                    <div className="space-y-2 relative">
                        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-primary-dark">
                            {title}
                        </h1>
                        <p className="text-[14px] font-medium text-secondary-text">
                            {isSuccess || isFallbackActive ? helperText : status}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 min-h-12.5 flex flex-col justify-end w-full">
                        {isSuccess ? (
                            <div className="space-y-3 w-full animate-premium-fade">
                                <button
                                    onClick={() => window.location.href = "/profiles"}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-sm flex items-center justify-center focus:outline-none"
                                >
                                    Ir al Dashboard
                                </button>
                            </div>
                        ) : isFallbackActive ? (
                            <div className="w-full animate-premium-fade">
                                <button
                                    onClick={() => {
                                        if (fallbackUrl) {
                                            window.location.href = fallbackUrl
                                        }
                                    }}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-premium-sm flex items-center justify-center focus:outline-none"
                                >
                                    Abrir extensión
                                </button>
                            </div>
                        ) : isError ? (
                            <div className="w-full animate-premium-fade">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-premium-sm flex items-center justify-center focus:outline-none"
                                >
                                    Reintentar conexión
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="absolute bottom-10 flex items-center justify-center opacity-40 gap-1.5 align-middle select-none">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-dark leading-none -mb-0.5">Mirror</span>
                <Image src="/icon.png" alt="Logo" width={14} height={14} priority />
            </div>
        </div>
    )
}

export default function ExtensionRedirectPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center bg-bg-main text-secondary-text text-[14px] font-medium">
                Cargando pasarela...
            </div>
        }>
            <RedirectContent />
        </Suspense>
    )
}

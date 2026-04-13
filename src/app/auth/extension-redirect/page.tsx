"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/routes"
import { parseExtensionNext } from "@/lib/extension-handoff"
import { useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

const BRIDGE_TIMEOUT_MS = 1800
const BRIDGE_RETRY_DELAY_MS = 50
const BRIDGE_ATTEMPTS = 3

type ExtensionTheme = "light" | "dark" | "system"
type ExtensionLanguage = "es" | "en" | "pt" | "fr" | "de"
type ExtensionCommentLanguageMode = "post" | "account"
type ExtensionGoalMode = "manual" | "auto"
type ExtensionGoalType = "Add Value" | "Challenge" | "Networking" | "Question"
type ExtensionPlatformId = "linkedin" | "twitter" | "reddit" | "youtube" | "upwork"
type ExtensionObjectiveSource = "platform_base" | "user_custom" | "imported_pack"
type ExtensionPlatformDefaultObjectiveIds = Record<ExtensionPlatformId, string | null>

interface ExtensionObjectiveProfile {
    id: string
    name: string
    canonicalGoal: ExtensionGoalType
    description: string
    strategyPrompt: string
    scope: ExtensionPlatformId[]
    source: ExtensionObjectiveSource
    active: boolean
    createdAt: number
    updatedAt: number
}

type ExtensionSyncFailureReason =
    | "invalid_message"
    | "sender_not_allowed"
    | "missing_tokens"
    | "set_session_error"
    | "unknown_type"
    | "unexpected_exception"
    | string

type ExtensionSyncResponse = {
    ok?: boolean
    reason?: ExtensionSyncFailureReason
}

type ExtensionSetSessionMessage = {
    type: "SET_SESSION"
    token: string
    refreshToken: string
    plan?: "Free" | "Pro" | "Elite"
    creditsRemaining?: number
    renewalDate?: string
    theme?: ExtensionTheme
    language?: ExtensionLanguage
    commentLanguageMode?: ExtensionCommentLanguageMode
    activeProfileId?: string | null
    defaultEmojis?: boolean
    autoInsert?: boolean
    confirmBeforeApply?: boolean
    notificationsEnabled?: boolean
    desktopAlertsEnabled?: boolean
    onboardingCompleted?: boolean
    goalMode?: ExtensionGoalMode
    goalModelVersion?: number
    objectiveLibrary?: ExtensionObjectiveProfile[]
    platformDefaultObjectiveIds?: Partial<ExtensionPlatformDefaultObjectiveIds>
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

function getBridgeErrorMessage(reason: ExtensionSyncFailureReason) {
    if (reason.includes("Receiving end does not exist")) {
        return "No logramos conectar con la extensión. Recárgala en chrome://extensions y vuelve a intentarlo."
    }

    if (reason === "sender_not_allowed") {
        return "No fue posible autorizar la conexión con la extensión. Vuelve a iniciar sesión y reintenta."
    }

    if (reason === "set_session_error") {
        return "No pudimos guardar tu sesión en la extensión. Intenta de nuevo en unos segundos."
    }

    if (reason === "missing_tokens") {
        return "Tu sesión ya no es válida para sincronizar. Inicia sesión nuevamente."
    }

    if (reason === "BRIDGE_TIMEOUT") {
        return "La extensión tardó en responder. Reintenta la conexión."
    }

    if (reason === "runtime_unavailable") {
        return "No detectamos la extensión activa. Recárgala y vuelve a intentarlo."
    }

    return "No pudimos completar la sincronización con la extensión. Reintenta o vuelve a iniciar sesión."
}

function normalizeThemeForExtension(value: unknown): ExtensionTheme | undefined {
    if (value === "light" || value === "dark" || value === "system") {
        return value
    }

    if (value === "auto") {
        return "system"
    }

    return undefined
}

function normalizeLanguage(value: unknown): ExtensionLanguage | undefined {
    if (value === "es" || value === "en" || value === "pt" || value === "fr" || value === "de") {
        return value
    }

    return undefined
}

function normalizeCommentLanguageMode(value: unknown): ExtensionCommentLanguageMode | undefined {
    if (value === "post" || value === "account") {
        return value
    }

    return undefined
}

function normalizeGoalMode(value: unknown): ExtensionGoalMode | undefined {
    if (value === "manual" || value === "auto") {
        return value
    }

    return undefined
}

function normalizePlan(value: unknown): "Free" | "Pro" | "Elite" | undefined {
    if (value === "Free" || value === "Pro" || value === "Elite") {
        return value
    }

    return undefined
}

function normalizeActiveProfileId(value: unknown): string | null | undefined {
    if (value === null) {
        return null
    }

    if (typeof value === "string" && value.trim().length > 0) {
        return value.trim()
    }

    return undefined
}

function RedirectContent() {
    const searchParams = useSearchParams()
    const parsedNext = useMemo(() => parseExtensionNext(searchParams.get("next")), [searchParams])
    const nextUrl = parsedNext?.normalized ?? null
    const [status, setStatus] = useState("Estableciendo conexión segura...")
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)

    const title = isSuccess
        ? "Sincronización completada"
        : isError
            ? "Error de conexión"
            : "Conectando extensión"

    const helperText = isSuccess
        ? "La sesión quedó sincronizada con la extensión. Esta pestaña se cerrará automáticamente."
        : isError
            ? status
            : ""

    const redirectToLogin = () => {
        const loginUrl = new URL(ROUTES.auth.login, window.location.origin)
        if (nextUrl) {
            loginUrl.searchParams.set("next", nextUrl)
        }

        window.location.href = loginUrl.toString()
    }

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

        const markBridgeFailure = (reason: ExtensionSyncFailureReason) => {
            console.warn("[extension-redirect] bridge_failed", reason)
            if (cancelled) return

            setStatus(getBridgeErrorMessage(reason))
            setIsError(true)
        }

        const proceedToExtension = async () => {
            if (!parsedNext || !nextUrl) {
                setStatus("El enlace de conexión no es válido. Vuelve a iniciar sesión desde la extensión.")
                setIsError(true)
                return
            }

            const extensionId = parsedNext.extensionId
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.access_token && session.user?.id) {
                if (!session.refresh_token) {
                    setStatus("No pudimos validar la sesión completa. Inicia sesión nuevamente para reintentar.")
                    setIsError(true)
                    return
                }

                const browserWindow = window as WindowWithExtensionBridge

                if (browserWindow.chrome?.runtime?.sendMessage) {
                    try {
                        const runtime = browserWindow.chrome.runtime

                        const [settingsQuery, accountQuery] = await Promise.all([
                            supabase
                                .from("user_settings")
                                .select("theme, language, comment_language_mode, active_profile_id, default_emojis, auto_insert, confirm_before_apply, notifications_enabled, desktop_alerts_enabled, onboarding_completed, goal_mode, goal_model_version, objective_library, platform_default_objective_ids")
                                .eq("user_id", session.user.id)
                                .maybeSingle(),
                            supabase
                                .from("user_account")
                                .select("plan, credits_remaining, renewal_date")
                                .eq("user_id", session.user.id)
                                .maybeSingle()
                        ])

                        const settingsRow =
                            settingsQuery.data && typeof settingsQuery.data === "object"
                                ? (settingsQuery.data as Record<string, unknown>)
                                : null

                        const accountRow =
                            accountQuery.data && typeof accountQuery.data === "object"
                                ? (accountQuery.data as Record<string, unknown>)
                                : null

                        const objectiveLibrary = Array.isArray(settingsRow?.objective_library)
                            ? (settingsRow.objective_library as ExtensionObjectiveProfile[])
                            : undefined

                        const platformDefaultObjectiveIds =
                            settingsRow?.platform_default_objective_ids && typeof settingsRow.platform_default_objective_ids === "object"
                                ? (settingsRow.platform_default_objective_ids as Partial<ExtensionPlatformDefaultObjectiveIds>)
                                : undefined

                        const message: ExtensionSetSessionMessage = {
                            type: "SET_SESSION",
                            token: session.access_token,
                            refreshToken: session.refresh_token,
                            plan: normalizePlan(accountRow?.plan),
                            creditsRemaining:
                                typeof accountRow?.credits_remaining === "number"
                                    ? Math.max(0, accountRow.credits_remaining)
                                    : undefined,
                            renewalDate:
                                typeof accountRow?.renewal_date === "string" && accountRow.renewal_date.trim().length > 0
                                    ? accountRow.renewal_date
                                    : undefined,
                            theme: normalizeThemeForExtension(settingsRow?.theme),
                            language: normalizeLanguage(settingsRow?.language),
                            commentLanguageMode: normalizeCommentLanguageMode(settingsRow?.comment_language_mode),
                            activeProfileId: normalizeActiveProfileId(settingsRow?.active_profile_id),
                            defaultEmojis:
                                typeof settingsRow?.default_emojis === "boolean"
                                    ? settingsRow.default_emojis
                                    : undefined,
                            autoInsert:
                                typeof settingsRow?.auto_insert === "boolean"
                                    ? settingsRow.auto_insert
                                    : undefined,
                            confirmBeforeApply:
                                typeof settingsRow?.confirm_before_apply === "boolean"
                                    ? settingsRow.confirm_before_apply
                                    : undefined,
                            notificationsEnabled:
                                typeof settingsRow?.notifications_enabled === "boolean"
                                    ? settingsRow.notifications_enabled
                                    : undefined,
                            desktopAlertsEnabled:
                                typeof settingsRow?.desktop_alerts_enabled === "boolean"
                                    ? settingsRow.desktop_alerts_enabled
                                    : undefined,
                            onboardingCompleted:
                                typeof settingsRow?.onboarding_completed === "boolean"
                                    ? settingsRow.onboarding_completed
                                    : undefined,
                            goalMode: normalizeGoalMode(settingsRow?.goal_mode),
                            goalModelVersion:
                                typeof settingsRow?.goal_model_version === "number"
                                    ? Math.max(2, settingsRow.goal_model_version)
                                    : undefined,
                            objectiveLibrary,
                            platformDefaultObjectiveIds
                        }

                        setStatus("Conectando tu sesión con la extensión...")

                        const response = await sendWithRetry(runtime, extensionId, message)
                        if (response?.ok) {
                            setStatus("Sesión conectada correctamente.")
                            setIsSuccess(true)
                            window.setTimeout(() => {
                                if (cancelled) return
                                try {
                                    window.close()
                                } catch { }
                            }, 700)
                        } else {
                            markBridgeFailure(response?.reason ?? "set_session_non_ok")
                        }
                    } catch (err) {
                        markBridgeFailure(err instanceof Error ? err.message : "set_session_exception")
                    }
                } else {
                    markBridgeFailure("runtime_unavailable")
                }
            } else {
                setStatus("Sesión expirada. Inicia sesión nuevamente para continuar.")
                setIsError(true)
            }
        }

        void proceedToExtension()

        return () => {
            cancelled = true
        }
    }, [nextUrl, parsedNext])

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 overflow-hidden">

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
                            {isSuccess ? helperText : status}
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
                        ) : isError ? (
                            <div className="w-full animate-premium-fade space-y-2.5">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-premium-sm flex items-center justify-center focus:outline-none"
                                >
                                    Reintentar conexión
                                </button>

                                <button
                                    onClick={redirectToLogin}
                                    className="w-full h-11 rounded-xl font-semibold text-[14px] border border-border-soft text-primary-dark hover:bg-surface-subtle transition-colors flex items-center justify-center focus:outline-none"
                                >
                                    Volver a login
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
            <div className="flex min-h-screen w-full items-center justify-center text-secondary-text text-[14px] font-medium">
                Cargando pasarela...
            </div>
        }>
            <RedirectContent />
        </Suspense>
    )
}

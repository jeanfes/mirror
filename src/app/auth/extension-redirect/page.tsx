"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/routes"
import { parseExtensionNext } from "@/lib/extension-handoff"
import { saveConnectedExtensionId } from "@/lib/extension-bridge"
import { useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useLanguageStore } from "@/store/useLanguageStore"
import type { Dictionary } from "@/lib/i18n/types"

const BRIDGE_TIMEOUT_MS = 1800
const BRIDGE_RETRY_DELAY_MS = 50
const BRIDGE_ATTEMPTS = 3

type ExtensionTheme = "light" | "dark" | "system"
type ExtensionLanguage = "es" | "en" | "pt" | "fr" | "de"
type ExtensionCommentLanguageMode = "post" | "account"
type ExtensionGoalType = "Add Value" | "Challenge" | "Networking" | "Question"
type ExtensionPlatformId = "linkedin" | "twitter" | "reddit" | "youtube" | "upwork"
type ExtensionObjectiveSource = "platform_base" | "user_custom" | "imported_pack"

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
    objectiveLibrary?: ExtensionObjectiveProfile[]
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

type RedirectCopy = Dictionary["app"]["extensionRedirect"]

const EXTENSION_OBJECTIVE_NAME_MAX = 64
const EXTENSION_OBJECTIVE_DESCRIPTION_MAX = 300
const EXTENSION_OBJECTIVE_PROMPT_MAX = 1200
const EXTENSION_OBJECTIVE_LIBRARY_MAX_ITEMS = 200
const EXTENSION_SUPPORTED_PLATFORMS: ExtensionPlatformId[] = ["linkedin", "twitter", "reddit", "youtube", "upwork"]

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null
}

function getBridgeErrorMessage(reason: ExtensionSyncFailureReason, copy: RedirectCopy) {
    if (reason.includes("Receiving end does not exist")) {
        return copy.bridgeReceivingEndMissing
    }

    if (reason === "sender_not_allowed") {
        return copy.bridgeSenderNotAllowed
    }

    if (reason === "set_session_error") {
        return copy.bridgeSetSessionError
    }

    if (reason === "missing_tokens") {
        return copy.bridgeMissingTokens
    }

    if (reason === "BRIDGE_TIMEOUT") {
        return copy.bridgeTimeout
    }

    if (reason === "runtime_unavailable") {
        return copy.bridgeRuntimeUnavailable
    }

    return copy.bridgeGenericError
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

function isExtensionPlatformId(value: unknown): value is ExtensionPlatformId {
    return typeof value === "string" && EXTENSION_SUPPORTED_PLATFORMS.includes(value as ExtensionPlatformId)
}

function normalizeExtensionObjectiveScope(value: unknown): ExtensionPlatformId[] {
    if (Array.isArray(value)) {
        const unique = new Set<ExtensionPlatformId>()

        for (const item of value) {
            if (isExtensionPlatformId(item)) {
                unique.add(item)
            }
        }

        const normalized = EXTENSION_SUPPORTED_PLATFORMS.filter((platform) => unique.has(platform))
        if (normalized.length > 0) {
            return normalized
        }
    }

    return [...EXTENSION_SUPPORTED_PLATFORMS]
}

function normalizeExtensionObjectiveSource(value: unknown): ExtensionObjectiveSource {
    if (value === "platform_base" || value === "user_custom" || value === "imported_pack") {
        return value
    }

    return "user_custom"
}

function normalizeExtensionObjectiveProfile(value: unknown): ExtensionObjectiveProfile | null {
    const candidate = asRecord(value)
    if (!candidate) {
        return null
    }

    const id = typeof candidate.id === "string" ? candidate.id.trim() : ""
    const name = typeof candidate.name === "string" ? candidate.name.trim() : ""

    if (!id || !name) {
        return null
    }

    const canonicalGoal = candidate.canonicalGoal
    if (
        canonicalGoal !== "Add Value" &&
        canonicalGoal !== "Challenge" &&
        canonicalGoal !== "Networking" &&
        canonicalGoal !== "Question"
    ) {
        return null
    }

    const description = typeof candidate.description === "string"
        ? candidate.description.trim().slice(0, EXTENSION_OBJECTIVE_DESCRIPTION_MAX)
        : ""

    const strategyPrompt = typeof candidate.strategyPrompt === "string"
        ? candidate.strategyPrompt.trim().slice(0, EXTENSION_OBJECTIVE_PROMPT_MAX)
        : ""

    return {
        id,
        name: name.slice(0, EXTENSION_OBJECTIVE_NAME_MAX),
        canonicalGoal,
        description,
        strategyPrompt,
        scope: normalizeExtensionObjectiveScope(candidate.scope),
        source: normalizeExtensionObjectiveSource(candidate.source),
        active: candidate.active !== false,
        createdAt: typeof candidate.createdAt === "number" ? candidate.createdAt : Date.now(),
        updatedAt: typeof candidate.updatedAt === "number" ? candidate.updatedAt : Date.now()
    }
}

function normalizeExtensionObjectiveLibrary(value: unknown): ExtensionObjectiveProfile[] | undefined {
    if (!Array.isArray(value)) {
        return undefined
    }

    const byId = new Map<string, ExtensionObjectiveProfile>()

    for (const item of value) {
        const objective = normalizeExtensionObjectiveProfile(item)
        if (!objective) {
            continue
        }

        byId.set(objective.id, objective)
        if (byId.size >= EXTENSION_OBJECTIVE_LIBRARY_MAX_ITEMS) {
            break
        }
    }

    return Array.from(byId.values())
}

function RedirectContent() {
    const t = useLanguageStore((state) => state.t)
    const copy = t.app.extensionRedirect
    const searchParams = useSearchParams()
    const parsedNext = useMemo(() => parseExtensionNext(searchParams.get("next")), [searchParams])
    const nextUrl = parsedNext?.normalized ?? null
    const [status, setStatus] = useState(copy.secureConnectionStatus)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)

    const title = isSuccess
        ? copy.syncCompletedTitle
        : isError
            ? copy.connectionErrorTitle
            : copy.connectingTitle

    const helperText = isSuccess
        ? copy.syncCompletedDesc
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

            setStatus(getBridgeErrorMessage(reason, copy))
            setIsError(true)
        }

        const proceedToExtension = async () => {
            if (!parsedNext || !nextUrl) {
                setStatus(copy.invalidLink)
                setIsError(true)
                return
            }

            const extensionId = parsedNext.extensionId
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.access_token && session.user?.id) {
                if (!session.refresh_token) {
                    setStatus(copy.incompleteSession)
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
                                .select("theme, language, comment_language_mode, active_profile_id, default_emojis, auto_insert, confirm_before_apply, notifications_enabled, desktop_alerts_enabled, objective_library")
                                .eq("user_id", session.user.id)
                                .maybeSingle(),
                            supabase
                                .from("user_account")
                                .select("plan, credits_remaining, renewal_date")
                                .eq("user_id", session.user.id)
                                .maybeSingle()
                        ])

                        const settingsRow = asRecord(settingsQuery.data)
                        const accountRow = asRecord(accountQuery.data)
                        const objectiveLibrary = normalizeExtensionObjectiveLibrary(settingsRow?.objective_library)

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
                            objectiveLibrary
                        }

                        setStatus(copy.syncSessionConnecting)

                        const response = await sendWithRetry(runtime, extensionId, message)
                        if (response?.ok) {
                            saveConnectedExtensionId(extensionId)
                            setStatus(copy.syncSessionConnected)
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
                setStatus(copy.sessionExpired)
                setIsError(true)
            }
        }

        void proceedToExtension()

        return () => {
            cancelled = true
        }
    }, [copy, nextUrl, parsedNext])

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
                                    {copy.goToDashboard}
                                </button>
                            </div>
                        ) : isError ? (
                            <div className="w-full animate-premium-fade space-y-2.5">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="neo-btn-primary w-full h-11 rounded-xl font-semibold text-[14px] shadow-premium-sm flex items-center justify-center focus:outline-none"
                                >
                                    {copy.retryConnection}
                                </button>

                                <button
                                    onClick={redirectToLogin}
                                    className="w-full h-11 rounded-xl font-semibold text-[14px] border border-border-soft text-primary-dark hover:bg-surface-subtle transition-colors flex items-center justify-center focus:outline-none"
                                >
                                    {copy.backToLogin}
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
    const t = useLanguageStore((state) => state.t)
    const copy = t.app.extensionRedirect

    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center text-secondary-text text-[14px] font-medium">
                {copy.gatewayLoading}
            </div>
        }>
            <RedirectContent />
        </Suspense>
    )
}

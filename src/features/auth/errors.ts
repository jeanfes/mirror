type SupabaseAuthErrorLike = {
    code?: string
    message?: string
    status?: number
}

export type LoginError =
    | "invalid_credentials"
    | "email_not_confirmed"
    | "rate_limit"
    | "auth_unavailable"
    | "connection_error"

export type RegisterError =
    | "email_taken"
    | "email_rate_limit"
    | "rate_limit"
    | "weak_password"
    | "signup_disabled"
    | "auth_unavailable"
    | "register_error"
    | "connection_error"

export type RecoveryError =
    | "email_rate_limit"
    | "rate_limit"
    | "auth_unavailable"
    | "connection_error"
    | "generic_error"

export type ResetPasswordError =
    | "weak_password"
    | "rate_limit"
    | "auth_unavailable"
    | "connection_error"
    | "generic_error"

export type OAuthStartError =
    | "oauth_unavailable"
    | "rate_limit"
    | "auth_unavailable"
    | "connection_error"

function normalizeError(error: SupabaseAuthErrorLike | null | undefined) {
    return {
        code: error?.code?.toLowerCase() ?? "",
        message: error?.message?.toLowerCase() ?? "",
        status: error?.status,
    }
}

function isAuthUnavailable(error: SupabaseAuthErrorLike | null | undefined) {
    const normalized = normalizeError(error)

    return Boolean(
        (typeof normalized.status === "number" && normalized.status >= 500) ||
            normalized.code.includes("service_unavailable") ||
            normalized.code.includes("internal") ||
            normalized.message.includes("service unavailable") ||
            normalized.message.includes("temporarily unavailable") ||
            normalized.message.includes("unexpected failure")
    )
}

function isRateLimit(error: SupabaseAuthErrorLike | null | undefined) {
    const normalized = normalizeError(error)

    return Boolean(
        normalized.status === 429 ||
            normalized.code.includes("rate_limit") ||
            normalized.message.includes("rate limit") ||
            normalized.message.includes("too many requests")
    )
}

export function mapLoginError(error: SupabaseAuthErrorLike | null | undefined): LoginError {
    const normalized = normalizeError(error)

    if (isAuthUnavailable(error)) return "auth_unavailable"
    if (isRateLimit(error)) return "rate_limit"

    if (
        normalized.code === "email_not_confirmed" ||
        normalized.message.includes("email not confirmed") ||
        normalized.message.includes("confirm your email")
    ) {
        return "email_not_confirmed"
    }

    return "invalid_credentials"
}

export function mapRegisterError(error: SupabaseAuthErrorLike | null | undefined): RegisterError {
    const normalized = normalizeError(error)

    if (isAuthUnavailable(error)) return "auth_unavailable"

    if (
        normalized.code === "over_email_send_rate_limit" ||
        normalized.message.includes("email rate limit") ||
        normalized.message.includes("confirmation email")
    ) {
        return "email_rate_limit"
    }

    if (isRateLimit(error)) return "rate_limit"

    if (
        normalized.code === "user_already_exists" ||
        normalized.message.includes("user already registered") ||
        normalized.message.includes("already registered")
    ) {
        return "email_taken"
    }

    if (
        normalized.code === "weak_password" ||
        normalized.message.includes("weak password") ||
        normalized.message.includes("password should be at least") ||
        normalized.message.includes("password is too weak")
    ) {
        return "weak_password"
    }

    if (
        normalized.code === "signup_disabled" ||
        normalized.message.includes("signups not allowed") ||
        normalized.message.includes("signup is disabled") ||
        normalized.message.includes("sign up is disabled")
    ) {
        return "signup_disabled"
    }

    return "register_error"
}

export function mapOAuthStartError(error: SupabaseAuthErrorLike | null | undefined): OAuthStartError {
    const normalized = normalizeError(error)

    if (isAuthUnavailable(error)) return "auth_unavailable"
    if (isRateLimit(error)) return "rate_limit"

    if (
        normalized.code.includes("provider") ||
        normalized.message.includes("provider") ||
        normalized.message.includes("not enabled") ||
        normalized.message.includes("unsupported")
    ) {
        return "oauth_unavailable"
    }

    return "oauth_unavailable"
}

export function mapRecoveryError(error: SupabaseAuthErrorLike | null | undefined): RecoveryError {
    const normalized = normalizeError(error)

    if (isAuthUnavailable(error)) return "auth_unavailable"
    if (isRateLimit(error)) return "rate_limit"

    if (
        normalized.code === "over_email_send_rate_limit" ||
        normalized.message.includes("email rate limit") ||
        normalized.message.includes("confirmation email")
    ) {
        return "email_rate_limit"
    }

    return "generic_error"
}

export function mapResetPasswordError(error: SupabaseAuthErrorLike | null | undefined): ResetPasswordError {
    const normalized = normalizeError(error)

    if (isAuthUnavailable(error)) return "auth_unavailable"
    if (isRateLimit(error)) return "rate_limit"

    if (
        normalized.code === "weak_password" ||
        normalized.message.includes("weak password") ||
        normalized.message.includes("password should be at least") ||
        normalized.message.includes("password is too weak")
    ) {
        return "weak_password"
    }

    return "generic_error"
}
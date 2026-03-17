import { z } from "zod"

type AuthErrors = {
    emailRequired: string
    emailInvalid: string
    passwordRequired: string
    passwordMin: string
    nameMin: string
}

export function createLoginSchema(errors: AuthErrors) {
    return z.object({
        email: z
            .string({ error: errors.emailRequired })
            .min(1, errors.emailRequired)
            .email({ error: errors.emailInvalid }),
        password: z
            .string({ error: errors.passwordRequired })
            .min(1, errors.passwordRequired),
    })
}

export function createRegisterSchema(errors: AuthErrors) {
    return z.object({
        name: z
            .string({ error: errors.nameMin })
            .min(2, errors.nameMin),
        email: z
            .string({ error: errors.emailRequired })
            .min(1, errors.emailRequired)
            .email({ error: errors.emailInvalid }),
        password: z
            .string({ error: errors.passwordRequired })
            .min(8, errors.passwordMin),
    })
}

export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>

export function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
    if (!password) return 0
    const hasUpper = /[A-Z]/.test(password)
    const hasDigit = /\d/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    const longEnough = password.length >= 8

    if (!longEnough || (!hasUpper && !hasDigit && !hasSpecial)) return 1
    if (longEnough && hasUpper && hasDigit && hasSpecial) return 3
    return 2
}

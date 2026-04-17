import { z } from "zod"

export const CONTACT_SUBJECT_KEYS = [
  "technical_support",
  "product_feedback",
  "billing",
  "sales",
  "other",
] as const

export type ContactSubjectKey = (typeof CONTACT_SUBJECT_KEYS)[number]

export const DEFAULT_CONTACT_SUBJECT_KEY: ContactSubjectKey = "technical_support"

type ContactFormErrors = {
  nameRequired: string
  emailRequired: string
  emailInvalid: string
  subjectRequired: string
  messageRequired: string
  messageMin: string
}

export function createContactFormSchema(errors: ContactFormErrors) {
  return z.object({
    name: z
      .string({ error: errors.nameRequired })
      .trim()
      .min(2, errors.nameRequired)
      .max(120, errors.nameRequired),
    email: z
      .string({ error: errors.emailRequired })
      .trim()
      .min(1, errors.emailRequired)
      .email({ error: errors.emailInvalid })
      .max(254, errors.emailInvalid),
    subjectKey: z
      .string({ error: errors.subjectRequired })
      .min(1, errors.subjectRequired)
      .refine(
        (value) => CONTACT_SUBJECT_KEYS.includes(value as ContactSubjectKey),
        { message: errors.subjectRequired }
      ),
    message: z
      .string({ error: errors.messageRequired })
      .trim()
      .min(10, errors.messageMin)
      .max(4000, errors.messageMin),
    website: z.string().max(0),
  })
}

export type ContactFormValues = z.infer<
  ReturnType<typeof createContactFormSchema>
>

export const contactApiSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  subjectKey: z.enum(CONTACT_SUBJECT_KEYS),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional().default(""),
  startedAt: z.number().int().nonnegative().optional(),
})

export type ContactApiPayload = z.infer<typeof contactApiSchema>

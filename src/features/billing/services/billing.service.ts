import { addDays } from "date-fns"
import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  UserAccount,
  Invoice,
  PaymentMethod,
  UserAccountRow,
  InvoiceRow,
} from "@/types/database.types"

export type { Invoice, PaymentMethod }

export type PlanName = "Free" | "Pro" | "Elite"

export interface PlanDefinition {
  name: PlanName
  price: string
  credits: number
  summary: string
  features: string[]
  recommended?: boolean
}

export const planDefinitions: PlanDefinition[] = [
  {
    name: "Free",
    price: "$0",
    credits: 120,
    summary:
      "Basic generation access for occasional posting without advanced tuning.",
    features: [
      "120 monthly generations",
      "1 basic voice profile",
      "Standard tone matching",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    credits: 1200,
    summary:
      "For professionals building a regular cadence and refining their own voice.",
    recommended: true,
    features: [
      "1,200 monthly generations",
      "10 dynamic voice profiles",
      "Tone strictness controls",
      "Basic history archive",
    ],
  },
  {
    name: "Elite",
    price: "$49",
    credits: 4000,
    summary:
      "High volume output and multi-persona testing for advanced users.",
    features: [
      "4,000 monthly generations",
      "Unlimited voice profiles",
      "Unlimited history archive",
      "Priority API processing",
    ],
  },
]

export async function setPlan(
  supabase: SupabaseClient,
  userId: string,
  planName: PlanName
) {
  const { data, error } = await supabase
    .from("user_account")
    .update({ plan: planName })
    .eq("user_id", userId)
    .select("*")
    .single()

  if (error) throw error
  return mapRowToAccountStatus(data as UserAccountRow)
}

function mapRowToAccountStatus(row: UserAccountRow): UserAccount {
  return {
    plan: row.plan,
    creditsRemaining: row.credits_remaining,
    creditsUsedThisMonth: row.credits_used_this_month ?? 0,
    renewalDate: row.renewal_date ?? addDays(new Date(), 30).toISOString(),
    subscriptionStatus: row.subscription_status,
    lastGenerationAt: row.last_generation_at,
  }
}

function formatAmount(currency: string, amountPaidInCents: number) {
  const normalizedCurrency = currency.toUpperCase()
  const amount = amountPaidInCents / 100
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function mapInvoiceStatus(rawStatus: string): Invoice["status"] {
  const normalized = rawStatus.trim().toLowerCase()
  if (
    ["paid", "pending", "failed", "refunded", "void"].includes(normalized)
  ) {
    return normalized as Invoice["status"]
  }
  return "unknown"
}

export async function getAccount(
  supabase: SupabaseClient,
  userId: string
): Promise<UserAccount> {
  const { data, error } = await supabase
    .from("user_account")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    return {
      plan: "Free",
      creditsRemaining: 0,
      creditsUsedThisMonth: 0,
      renewalDate: addDays(new Date(), 30).toISOString(),
      subscriptionStatus: null,
      lastGenerationAt: null,
    }
  }

  return mapRowToAccountStatus(data as UserAccountRow)
}

export async function getInvoices(
  supabase: SupabaseClient,
  userId: string
): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return ((data ?? []) as InvoiceRow[]).map((invoice) => ({
    id: invoice.id,
    date: invoice.created_at,
    amount: formatAmount(invoice.currency, invoice.amount_paid),
    status: mapInvoiceStatus(invoice.status),
    downloadUrl: invoice.invoice_url ?? "#",
  }))
}

interface BillingInfoResponse {
  payment_method?: {
    id: string
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  subscription?: { update_payment_method_url: string }
  portal_url?: string
}

export async function getBillingInfo(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!user || !supabaseUrl) {
    return { paymentMethod: null, updateUrl: null, portalUrl: null }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token

  if (!accessToken) {
    return { paymentMethod: null, updateUrl: null, portalUrl: null }
  }

  let payload: BillingInfoResponse
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/billing-info`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      return { paymentMethod: null, updateUrl: null, portalUrl: null }
    }

    payload = (await response.json()) as BillingInfoResponse
  } catch {
    return { paymentMethod: null, updateUrl: null, portalUrl: null }
  }

  let pm: PaymentMethod | null = null

  if (payload.payment_method) {
    const brand = (payload.payment_method.brand ?? "visa").toLowerCase()
    const mappedType: PaymentMethod["brand"] = brand.includes("master")
      ? "mastercard"
      : brand.includes("amex")
        ? "amex"
        : "visa"

    const month = String(payload.payment_method.exp_month).padStart(2, "0")
    const year = String(payload.payment_method.exp_year).slice(-2)

    pm = {
      id: payload.payment_method.id,
      brand: mappedType,
      last4: payload.payment_method.last4 ?? "0000",
      expiry: `${month}/${year}`,
      isDefault: true,
    }
  }

  return {
    paymentMethod: pm,
    updateUrl: payload.subscription?.update_payment_method_url ?? null,
    portalUrl: payload.portal_url ?? null,
  }
}

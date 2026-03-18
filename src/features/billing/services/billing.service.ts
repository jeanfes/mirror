import { addDays } from "date-fns"
import { getAuthContext } from "@/lib/supabase/auth-context"
import type { UserAccount, Invoice, PaymentMethod, UserAccountRow, InvoiceRow, PlanQuotasRow } from "@/types/database.types"

export type { Invoice, PaymentMethod, UserAccount }

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
    credits: 50,
    summary: "Basic generation access for occasional posting without advanced tuning.",
    features: [
      "50 monthly generations",
      "1 basic voice profile",
      "Standard tone matching",
      "Community support"
    ]
  },
  {
    name: "Pro",
    price: "$19",
    credits: 250,
    summary: "For professionals building a regular cadence and refining their own voice.",
    recommended: true,
    features: [
      "250 monthly generations",
      "3 dynamic voice profiles",
      "Tone strictness controls",
      "Basic history archive"
    ]
  },
  {
    name: "Elite",
    price: "$49",
    credits: 1000,
    summary: "High volume output and multi-persona testing for advanced users.",
    features: [
      "1,000 monthly generations",
      "Unlimited voice profiles",
      "Unlimited history archive",
      "Priority API processing"
    ]
  }
]

export async function setPlan(planName: PlanName) {
  const { supabase, userId } = await getAuthContext()
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
    lastGenerationAt: row.last_generation_at
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
      maximumFractionDigits: 2
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function mapInvoiceStatus(rawStatus: string): Invoice["status"] {
  const normalized = rawStatus.trim().toLowerCase()
  if (["paid", "pending", "failed", "refunded", "void"].includes(normalized)) {
    return normalized as Invoice["status"]
  }
  return "unknown"
}

export async function getAccount(): Promise<UserAccount> {
  const { supabase, userId } = await getAuthContext()

  const { data, error } = await supabase
    .from("user_account")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("user_account")
      .insert({ user_id: userId, plan: "Free" })
      .select("*")
      .single()

    if (createError) throw createError
    return mapRowToAccountStatus(created as UserAccountRow)
  }

  return mapRowToAccountStatus(data as UserAccountRow)
}

export async function getPlanQuotas(planName: PlanQuotasRow["plan"]) {
  const { supabase } = await getAuthContext()
  const { data, error } = await supabase
    .from("plan_quotas")
    .select("*")
    .eq("plan", planName)
    .single()

  if (error) throw error

  return data as PlanQuotasRow
}

export async function getInvoices(): Promise<Invoice[]> {
  const { supabase, userId } = await getAuthContext()

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
    downloadUrl: invoice.invoice_url ?? "#"
  }))
}

interface BillingInfoResponse {
  payment_method?: { id: string; brand: string; last4: string; exp_month: number; exp_year: number }
  subscription?: { update_payment_method_url: string }
  portal_url?: string
}


export async function getBillingInfo() {
  const { supabase } = await getAuthContext()
  const { data, error } = await supabase.functions.invoke("billing-info", { body: {} })
  
  if (error || !data) {
    return { paymentMethod: null, updateUrl: null, portalUrl: null }
  }

  const payload = data as BillingInfoResponse
  let pm: PaymentMethod | null = null

  if (payload.payment_method) {
    const brand = (payload.payment_method.brand ?? "visa").toLowerCase()
    const mappedType: PaymentMethod["brand"] =
      brand.includes("master") ? "mastercard" :
      brand.includes("amex") ? "amex" :
      "visa"

    const month = String(payload.payment_method.exp_month).padStart(2, "0")
    const year = String(payload.payment_method.exp_year).slice(-2)

    pm = {
      id: payload.payment_method.id,
      brand: mappedType,
      last4: payload.payment_method.last4 ?? "0000",
      expiry: `${month}/${year}`,
      isDefault: true
    }
  }

  return {
    paymentMethod: pm,
    updateUrl: payload.subscription?.update_payment_method_url ?? null,
    portalUrl: payload.portal_url ?? null
  }
}

export async function getUsageStats() {
  const { supabase, userId } = await getAuthContext()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: monthHistory, error } = await supabase
    .from("generation_history")
    .select("status, source, post_author, created_at")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .gte("created_at", startOfMonth.toISOString())
    .order("created_at", { ascending: false })

  if (error) throw error

  const items = monthHistory ?? []
  const generatedThisMonth = items.length
  const appliedComments = items.filter(h => h.status === "applied").length
  const reusedComments = items.filter(h => h.source === "history_reuse").length
  const adoptionRate = generatedThisMonth > 0 ? Math.round((appliedComments / generatedThisMonth) * 100) : 0
  const lastActivity = items[0]?.post_author ?? null

  return {
    generatedThisMonth,
    appliedComments,
    reusedComments,
    adoptionRate,
    lastActivity
  }
}

export async function createCheckout(plan: "Pro" | "Elite") {
  const { supabase } = await getAuthContext()

  const origin = typeof window !== "undefined" ? window.location.origin : "https://tudominio.com"

  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {
      plan,
      success_url: `${origin}/account?upgraded=true`,
      cancel_url: `${origin}/plans`
    }
  })

  if (error) throw error
  return data as { checkout_url: string }
}

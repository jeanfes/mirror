import { addDays } from "date-fns"
import type { SupabaseClient } from "@supabase/supabase-js"
import { callEdgeFunction } from "@/lib/supabase/edge-functions"
import type {
  UserAccount,
  Invoice,
  PaymentMethod,
  PlanQuotasRow,
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
    price: "$9.99",
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
  // {
  //   name: "Elite",
  //   price: "$49",
  //   credits: 4000,
  //   summary:
  //     "High volume output and multi-persona testing for advanced users.",
  //   features: [
  //     "4,000 monthly generations",
  //     "Unlimited voice profiles",
  //     "Unlimited history archive",
  //     "Priority API processing",
  //   ],
  // },
]

const PLAN_PRICES: Record<PlanName, string> = {
  Free: "$0",
  Pro: "$9.99",
  Elite: "$49",
}

const USER_ACCOUNT_SELECT_COLUMNS =
  "plan, credits_remaining, credits_used_this_month, renewal_date, subscription_status, last_generation_at"
const INVOICES_SELECT_COLUMNS = "id, created_at, currency, amount_paid, status, invoice_url"

const PLAN_ORDER: PlanName[] = ["Free", "Pro"]

function normalizePlanName(value: unknown): PlanName | null {
  if (value === "Free" || value === "Pro" || value === "Elite") {
    return value
  }

  return null
}

function formatProfilesFeature(maxProfiles: number | null) {
  if (maxProfiles === null) {
    return "Unlimited voice profiles"
  }

  if (maxProfiles >= 999) {
    return "Unlimited voice profiles"
  }

  return `${maxProfiles.toLocaleString()} voice profiles`
}

function formatHistoryRetentionFeature(days: number) {
  if (days >= 3650) {
    return "Unlimited history retention"
  }

  return `${days.toLocaleString()} days history retention`
}

function mapAllowedFeature(rawFeature: string): string {
  return rawFeature
    .split(/[\s_\-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ")
}

function buildPlanSummary(quota: PlanQuotasRow): string {
  const profileText = quota.max_profiles === null || quota.max_profiles >= 999
    ? "unlimited profiles"
    : `${quota.max_profiles.toLocaleString()} profiles`

  return `${quota.monthly_generations.toLocaleString()} generations per month with ${profileText}.`
}

export async function getPlanDefinitions(
  supabase: SupabaseClient
): Promise<PlanDefinition[]> {
  const { data, error } = await supabase
    .from("plan_quotas")
    .select("plan, monthly_generations, max_profiles, max_history_retention_days, features_allowed, price_cents")

  if (error) {
    throw error
  }

  const quotas: PlanDefinition[] = []

  for (const row of (data ?? []) as PlanQuotasRow[]) {
    const normalizedPlan = normalizePlanName(row.plan)
    if (!normalizedPlan) {
      continue
    }

    const allowedFeatures = Array.isArray(row.features_allowed)
      ? row.features_allowed.map(mapAllowedFeature)
      : []

    const features = [
      `${row.monthly_generations.toLocaleString()} monthly generations`,
      formatProfilesFeature(row.max_profiles),
      formatHistoryRetentionFeature(row.max_history_retention_days),
      ...allowedFeatures,
    ]

    let dynamicPrice = PLAN_PRICES[normalizedPlan]
    if (typeof row.price_cents === "number") {
      dynamicPrice = row.price_cents === 0 
        ? "$0" 
        : `$${(row.price_cents / 100).toFixed(2).replace(/\.00$/, "")}`
    }

    quotas.push({
      name: normalizedPlan,
      price: dynamicPrice,
      credits: row.monthly_generations,
      summary: buildPlanSummary(row),
      features: Array.from(new Set(features)),
      recommended: normalizedPlan === "Pro",
    })
  }

  if (quotas.length === 0) {
    return planDefinitions
  }

  const orderedQuotas = PLAN_ORDER
    .map((planName) => quotas.find((quota) => quota.name === planName))
    .filter((plan): plan is PlanDefinition => plan !== undefined)

  return orderedQuotas.length > 0 ? orderedQuotas : planDefinitions
}

export async function startCheckout(
  supabase: SupabaseClient,
  planName: PlanName
) {
  if (planName !== "Pro") {
    throw new Error("Invalid plan. Only Pro plan is allowed for new checkouts.");
  }

  type CheckoutResponse = {
    checkout_url?: string
    checkoutUrl?: string
    url?: string
    data?: {
      checkout_url?: string
      checkoutUrl?: string
      url?: string
    }
  }

  const successUrl = `${window.location.origin}/account?checkout=success`
  const cancelUrl = window.location.href

  const payload = await callEdgeFunction<CheckoutResponse>(
    supabase,
    "create-checkout",
    { plan: planName, success_url: successUrl, cancel_url: cancelUrl }
  )

  const checkoutUrl =
    payload.checkout_url ||
    payload.checkoutUrl ||
    payload.url ||
    payload.data?.checkout_url ||
    payload.data?.checkoutUrl ||
    payload.data?.url

  if (!checkoutUrl) {
    throw new Error("Checkout URL was not returned")
  }

  return checkoutUrl
}

function mapRowToAccountStatus(
  row: Pick<
    UserAccountRow,
    "plan" | "credits_remaining" | "credits_used_this_month" | "renewal_date" | "subscription_status" | "last_generation_at"
  >
): UserAccount {
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
  const { data: accountRow, error: accountError } = await supabase
    .from("user_account")
    .select(USER_ACCOUNT_SELECT_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle()

  if (accountError) throw accountError

  if (!accountRow) {
    return {
      plan: "Free",
      creditsRemaining: 0,
      creditsUsedThisMonth: 0,
      renewalDate: addDays(new Date(), 30).toISOString(),
      subscriptionStatus: null,
      lastGenerationAt: null,
    }
  }

  const account = mapRowToAccountStatus(accountRow)

  // Fetch quota separately since there's no FK relationship for join
  const { data: quotaRow, error: quotaError } = await supabase
    .from("plan_quotas")
    .select("plan, monthly_generations, max_profiles, max_history_retention_days, features_allowed, price_cents")
    .eq("plan", accountRow.plan)
    .maybeSingle()

  if (!quotaError && quotaRow) {
    account.quota = quotaRow as PlanQuotasRow
  }

  return account
}

export async function getInvoices(
  supabase: SupabaseClient,
  userId: string
): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICES_SELECT_COLUMNS)
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

export async function cancelSubscription(supabase: SupabaseClient) {
  await callEdgeFunction<Record<string, unknown>>(
    supabase,
    "cancel-subscription",
    {}
  )
}

export async function getBillingInfo(supabase: SupabaseClient) {
  let payload: BillingInfoResponse
  try {
    payload = await callEdgeFunction<BillingInfoResponse>(
      supabase,
      "billing-info",
      {}
    )
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

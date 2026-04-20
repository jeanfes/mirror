import { addDays } from "date-fns"
import type { SupabaseClient } from "@supabase/supabase-js"
import { callEdgeFunction } from "@/lib/supabase/edge-functions"
import type {
  UserAccount,
  Invoice,
  PaymentMethod,
  CreditTransaction,
  PlanChangeHistory,
  AccountStats,
  PlanQuotasRow,
  UserAccountRow,
  InvoiceRow,
} from "@/types/database.types"

export type { Invoice, PaymentMethod, CreditTransaction, PlanChangeHistory, AccountStats }

export type PlanName = "Free" | "Pro"

export interface PlanDefinition {
  name: PlanName
  price: string
  credits: number
  summary: string
  features: string[]
  recommended?: boolean
  metadata?: {
    monthlyGenerations: number
    maxProfiles: number | null
    historyRetentionDays: number
    allowedFeatures: string[]
  }
}

export const planDefinitions: PlanDefinition[] = [
  {
    name: "Free",
    price: "$0",
    credits: 120,
    summary:
      "Free generation access for occasional posting without advanced tuning.",
    features: [
      "120 generations / month",
      "1 free voice profile",
      "Free configuration",
      "Community support",
    ],
    metadata: {
      monthlyGenerations: 120,
      maxProfiles: 1,
      historyRetentionDays: 30,
      allowedFeatures: ["free_config", "community_support"],
    },
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
    metadata: {
      monthlyGenerations: 1200,
      maxProfiles: 10,
      historyRetentionDays: 180,
      allowedFeatures: [
        "tone_strictness",
        "history_archive",
        "priority_support",
        "rewrite",
        "advanced_tone",
      ],
    },
  },
]

const PLAN_PRICES: Record<PlanName, string> = {
  Free: "$0",
  Pro: "$9.99",
}

const USER_ACCOUNT_SELECT_COLUMNS =
  "plan, credits_remaining, credits_used_this_month, renewal_date, subscription_status, last_generation_at"
const INVOICES_SELECT_COLUMNS = "id, created_at, currency, amount_paid, status, invoice_url"

const PLAN_ORDER: PlanName[] = ["Free", "Pro"]

function normalizePlanName(value: unknown): PlanName | null {
  if (value === "Free" || value === "Pro") {
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
  if (rawFeature.toLowerCase() === "basic") return "Base"
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

    const rawFeatures = Array.isArray(row.features_allowed)
      ? row.features_allowed.map(String)
      : []
    
    const allowedFeatureNames = rawFeatures.map(mapAllowedFeature)

    const features = [
      `${row.monthly_generations.toLocaleString()} monthly generations`,
      formatProfilesFeature(row.max_profiles),
      formatHistoryRetentionFeature(row.max_history_retention_days),
      ...allowedFeatureNames,
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
      metadata: {
        monthlyGenerations: row.monthly_generations,
        maxProfiles: row.max_profiles,
        historyRetentionDays: row.max_history_retention_days,
        allowedFeatures: rawFeatures,
      },
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
    {
      plan: planName,
      success_url: successUrl,
      cancel_url: cancelUrl,
      redirect_url: window.location.href,
    }
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
  const normalizedPlan = normalizePlanName(row.plan) ?? "Free"

  return {
    plan: normalizedPlan,
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

type SupabaseErrorLike = {
  code?: string
  message?: string
  details?: string
  hint?: string
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return fallback
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null
  }
  return toNumber(value, 0)
}

function isMissingRelationError(error: unknown): boolean {
  const err = (error ?? {}) as SupabaseErrorLike
  const message = (err.message ?? "").toLowerCase()
  return (
    err.code === "42P01" ||
    (message.includes("relation") && message.includes("does not exist"))
  )
}

function isRpcLookupError(error: unknown): boolean {
  const err = (error ?? {}) as SupabaseErrorLike
  const message = (err.message ?? "").toLowerCase()
  return (
    err.code === "42883" ||
    err.code === "PGRST202" ||
    err.code === "PGRST204" ||
    (message.includes("function") && message.includes("does not exist")) ||
    message.includes("could not find the function")
  )
}

function normalizeDate(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value
  }
  return new Date().toISOString()
}

function mapCreditTransactionRow(row: Record<string, unknown>, index: number): CreditTransaction {
  const createdAt = normalizeDate(row.created_at)
  const delta = toNumber(row.delta ?? row.credits_delta ?? row.amount ?? row.change ?? 0, 0)
  const balanceAfter = toNullableNumber(
    row.balance_after ?? row.credits_after ?? row.credits_remaining ?? null
  )

  return {
    id: String(row.id ?? `${createdAt}-${index}`),
    createdAt,
    delta,
    balanceAfter,
    type: String(row.type ?? row.kind ?? row.event_type ?? "unknown"),
    reason: row.reason ? String(row.reason) : null,
  }
}

function mapPlanChangeRow(row: Record<string, unknown>, index: number): PlanChangeHistory {
  const createdAt = normalizeDate(row.created_at)

  return {
    id: String(row.id ?? `${createdAt}-${index}`),
    createdAt,
    fromPlan: normalizePlanName(row.from_plan ?? row.previous_plan ?? row.old_plan),
    toPlan: normalizePlanName(row.to_plan ?? row.new_plan ?? row.plan),
    reason: row.reason ? String(row.reason) : null,
  }
}

function mapAccountStats(data: Record<string, unknown>): AccountStats {
  const successRateValue = data.success_rate ?? data.successRate ?? data.apply_rate ?? null
  const parsedSuccessRate = toNullableNumber(successRateValue)

  return {
    totalGenerated: toNumber(data.total_generated ?? data.totalGenerated ?? data.generated_total ?? 0, 0),
    totalApplied: toNumber(data.total_applied ?? data.totalApplied ?? data.applied_total ?? 0, 0),
    monthlyGenerated: toNumber(data.monthly_generated ?? data.monthlyGenerated ?? data.generated_this_month ?? 0, 0),
    monthlyApplied: toNumber(data.monthly_applied ?? data.monthlyApplied ?? data.applied_this_month ?? 0, 0),
    successRate: parsedSuccessRate,
  }
}

export async function getCreditTransactions(
  supabase: SupabaseClient,
  userId: string,
  limit = 50
): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    if (isMissingRelationError(error)) {
      return []
    }
    throw error
  }

  return ((data ?? []) as Record<string, unknown>[]).map((row, index) => mapCreditTransactionRow(row, index))
}

export async function getPlanChangeHistory(
  supabase: SupabaseClient,
  userId: string,
  limit = 50
): Promise<PlanChangeHistory[]> {
  const { data, error } = await supabase
    .from("plan_change_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    if (isMissingRelationError(error)) {
      return []
    }
    throw error
  }

  return ((data ?? []) as Record<string, unknown>[]).map((row, index) => mapPlanChangeRow(row, index))
}

export async function getAccountStats(
  supabase: SupabaseClient,
  userId: string
): Promise<AccountStats | null> {
  type RpcExecutor = (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: unknown }>

  const rpc = supabase.rpc as unknown as RpcExecutor
  const attempts: Array<Record<string, unknown> | undefined> = [
    undefined,
    { user_id: userId },
    { p_user_id: userId },
  ]

  for (const params of attempts) {
    const { data, error } = await rpc("get_account_stats", params)

    if (error) {
      if (isRpcLookupError(error)) {
        continue
      }
      throw error
    }

    if (!data) {
      return null
    }

    if (Array.isArray(data)) {
      const first = data[0]
      if (first && typeof first === "object") {
        return mapAccountStats(first as Record<string, unknown>)
      }
      return null
    }

    if (typeof data === "object") {
      return mapAccountStats(data as Record<string, unknown>)
    }

    return null
  }

  return null
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
    .eq("plan", account.plan)
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
    brand: string
    last4: string
    ends_at: string | null
  }
  subscription?: { update_payment_url: string | null }
  portal_url?: string
}

export async function cancelSubscription(supabase: SupabaseClient) {
  await callEdgeFunction<Record<string, unknown>>(
    supabase,
    "cancel-subscription",
    undefined,
    "DELETE"
  )
}

export async function getBillingInfo(supabase: SupabaseClient) {
  let payload: BillingInfoResponse
  try {
    payload = await callEdgeFunction<BillingInfoResponse>(
      supabase,
      "billing-info",
      undefined,
      "GET"
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

    let expiry = "--/--"
    if (typeof payload.payment_method.ends_at === "string") {
      const parsed = new Date(payload.payment_method.ends_at)
      if (!Number.isNaN(parsed.getTime())) {
        const month = String(parsed.getMonth() + 1).padStart(2, "0")
        const year = String(parsed.getFullYear()).slice(-2)
        expiry = `${month}/${year}`
      }
    }

    pm = {
      id: "billing-info",
      brand: mappedType,
      last4: payload.payment_method.last4 ?? "0000",
      expiry,
      isDefault: true,
    }
  }

  return {
    paymentMethod: pm,
    updateUrl: payload.subscription?.update_payment_url ?? null,
    portalUrl: payload.portal_url ?? null,
  }
}

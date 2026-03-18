import { addDays } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import type { AccountStatus } from "@/types/dashboard"

export type PlanName = AccountStatus["plan"]

export interface PlanDefinition {
	name: PlanName
	credits: number
	price: string
	summary: string
	features: string[]
	recommended?: boolean
}

export interface Invoice {
	id: string
	date: string
	amount: string
	status: "paid" | "pending" | "failed" | "refunded" | "void" | "unknown"
	downloadUrl: string
}

export interface PaymentMethod {
	id: string
	type: "visa" | "mastercard" | "amex"
	last4: string
	expiry: string
	isDefault: boolean
}

export const planDefinitions: PlanDefinition[] = [
	{
		name: "Free",
		credits: 120,
		price: "$0",
		summary: "Best for testing the extension workflow with a single active profile.",
		features: ["1 active profile", "Basic history", "Community support"]
	},
	{
		name: "Pro",
		credits: 1200,
		price: "$19",
		summary: "Best for daily usage, multiple voices and a consistent posting rhythm.",
		features: ["10 profiles", "Advanced history", "Priority support"],
		recommended: true
	},
	{
		name: "Elite",
		credits: 4000,
		price: "$59",
		summary: "Best for power users running multiple brand voices or heavy weekly output.",
		features: ["Unlimited profiles", "Advanced analytics", "Team collaboration"]
	}
]

interface UserAccountRow {
	plan: PlanName
	credits_remaining: number
	renewal_date: string | null
}

interface InvoiceRow {
	id: string
	amount_paid: number
	currency: string
	status: string
	created_at: string
	invoice_url: string | null
}

interface BillingInfoMethod {
	id?: string
	brand?: string
	last4?: string
	exp_month?: number
	exp_year?: number
	is_default?: boolean
}

interface BillingInfoResponse {
	paymentMethods?: BillingInfoMethod[]
}

async function getAuthContext() {
	const supabase = createClient()
	const { data, error } = await supabase.auth.getUser()

	if (error || !data.user) {
		throw new Error("Could not resolve authenticated user")
	}

	return {
		supabase,
		userId: data.user.id
	}
}

function mapRowToAccountStatus(row: UserAccountRow): AccountStatus {
	return {
		plan: row.plan,
		creditsRemaining: row.credits_remaining,
		renewalDate: row.renewal_date ?? addDays(new Date(), 30).toISOString()
	}
}

function formatAmount(currency: string, amountPaid: number) {
	const normalizedCurrency = currency.toUpperCase()
	const amount = amountPaid / 100

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

	if (normalized === "paid") return "paid"
	if (normalized === "pending") return "pending"
	if (normalized === "failed") return "failed"
	if (normalized === "refunded") return "refunded"
	if (normalized === "void") return "void"

	return "unknown"
}

export async function getAccount(): Promise<AccountStatus> {
	const { supabase, userId } = await getAuthContext()

	const { data, error } = await supabase
		.from("user_account")
		.select("plan, credits_remaining, renewal_date")
		.eq("user_id", userId)
		.maybeSingle()

	if (error) {
		throw error
	}

	if (!data) {
		const { data: created, error: createError } = await supabase
			.from("user_account")
			.insert({ user_id: userId })
			.select("plan, credits_remaining, renewal_date")
			.single()

		if (createError) {
			throw createError
		}

		return mapRowToAccountStatus(created as UserAccountRow)
	}

	return mapRowToAccountStatus(data as UserAccountRow)
}

export async function setPlan(planName: PlanName): Promise<AccountStatus> {
	const { supabase, userId } = await getAuthContext()
	const selected = planDefinitions.find((plan) => plan.name === planName)

	const { data: quotaData } = await supabase
		.from("plan_quotas")
		.select("monthly_generations")
		.eq("plan", planName)
		.maybeSingle()

	const nextCredits = quotaData?.monthly_generations ?? selected?.credits ?? 120
	const renewalDate = addDays(new Date(), 30).toISOString()

	const { data, error } = await supabase
		.from("user_account")
		.upsert({
			user_id: userId,
			plan: planName,
			credits_remaining: nextCredits,
			renewal_date: renewalDate,
			updated_at: new Date().toISOString()
		}, { onConflict: "user_id" })
		.select("plan, credits_remaining, renewal_date")
		.single()

	if (error) {
		throw error
	}

	await supabase.from("plan_change_history").insert({
		user_id: userId,
		to_plan: planName,
		reason: "Changed from dashboard"
	})

	return mapRowToAccountStatus(data as UserAccountRow)
}

export async function getInvoices(): Promise<Invoice[]> {
	const { supabase, userId } = await getAuthContext()

	const { data, error } = await supabase
		.from("invoices")
		.select("id, amount_paid, currency, status, created_at, invoice_url")
		.eq("user_id", userId)
		.order("created_at", { ascending: false })

	if (error) {
		throw error
	}

	return ((data ?? []) as InvoiceRow[]).map((invoice) => ({
		id: invoice.id,
		date: invoice.created_at,
		amount: formatAmount(invoice.currency, invoice.amount_paid),
		status: mapInvoiceStatus(invoice.status),
		downloadUrl: invoice.invoice_url ?? "#"
	}))
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
	const { supabase } = await getAuthContext()

	const { data, error } = await supabase.functions.invoke("billing-info")
	if (error || !data) {
		return []
	}

	const payload = data as BillingInfoResponse
	const methods = payload.paymentMethods ?? []

	return methods.map((method, index) => {
		const brand = (method.brand ?? "visa").toLowerCase()
		const mappedType: PaymentMethod["type"] =
			brand.includes("master") ? "mastercard" :
			brand.includes("amex") ? "amex" :
			"visa"

		const month = method.exp_month ? String(method.exp_month).padStart(2, "0") : "01"
		const year = method.exp_year ? String(method.exp_year).slice(-2) : "00"

		return {
			id: method.id ?? `pm-${index}`,
			type: mappedType,
			last4: method.last4 ?? "0000",
			expiry: `${month}/${year}`,
			isDefault: !!method.is_default
		}
	})
}
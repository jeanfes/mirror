import { addDays } from "date-fns"
import { account as seedAccount } from "@/lib/mock-data"
import type { AccountStatus } from "@/types/dashboard"

const STORAGE_KEY = "mirror_account_v1"

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
  status: "Paid" | "Pending"
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

function isClient() {
  return typeof window !== "undefined"
}

function readAccount(): AccountStatus {
  if (!isClient()) return seedAccount

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return seedAccount

  try {
    return JSON.parse(raw) as AccountStatus
  } catch {
    return seedAccount
  }
}

function writeAccount(value: AccountStatus) {
  if (!isClient()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export async function getAccount(): Promise<AccountStatus> {
  return readAccount()
}

export async function setPlan(planName: PlanName): Promise<AccountStatus> {
  const selected = planDefinitions.find((plan) => plan.name === planName)
  if (!selected) return readAccount()

  const next: AccountStatus = {
    plan: selected.name,
    creditsRemaining: selected.credits,
    renewalDate: addDays(new Date(), 30).toISOString()
  }

  writeAccount(next)
  return next
}

export async function getInvoices(): Promise<Invoice[]> {
  return [
    {
      id: "INV-001",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: "$19.00",
      status: "Paid",
      downloadUrl: "#"
    },
    {
      id: "INV-002",
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      amount: "$19.00",
      status: "Paid",
      downloadUrl: "#"
    }
  ]
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return [
    {
      id: "pm-001",
      type: "visa",
      last4: "4242",
      expiry: "12/26",
      isDefault: true
    }
  ]
}

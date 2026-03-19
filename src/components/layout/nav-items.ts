import {
  Crown,
  CreditCard,
  History,
  Settings,
  Trash2,
  Users
} from "lucide-react"
import { ROUTES } from "@/lib/routes"

import { Dictionary } from "@/lib/i18n"

export const getNavItems = (t: Dictionary) => [
  { href: ROUTES.private.profiles, label: t.app.navigation.profiles, icon: Users },
  { href: ROUTES.private.history, label: t.app.navigation.history, icon: History },
  { href: ROUTES.private.settings, label: t.app.navigation.settings, icon: Settings },
  { href: ROUTES.private.account, label: t.app.navigation.account, icon: CreditCard },
  { href: ROUTES.private.plans, label: t.app.navigation.plans, icon: Crown },
  { href: ROUTES.private.trash, label: t.app.navigation.trash, icon: Trash2 }
] as const

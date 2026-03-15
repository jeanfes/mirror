import {
  Crown,
  CreditCard,
  History,
  Settings,
  Trash2,
  Users
} from "lucide-react"
import { ROUTES } from "@/lib/routes"

export const navItems = [
  { href: ROUTES.private.profiles, label: "Profiles", icon: Users },
  { href: ROUTES.private.history, label: "History", icon: History },
  { href: ROUTES.private.settings, label: "Settings", icon: Settings },
  { href: ROUTES.private.account, label: "Account", icon: CreditCard },
  { href: ROUTES.private.plans, label: "Plans", icon: Crown },
  { href: ROUTES.private.trash, label: "Trash", icon: Trash2 }
] as const

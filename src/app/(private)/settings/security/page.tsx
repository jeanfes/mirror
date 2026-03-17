"use client"

import Link from "next/link"
import { ChevronLeft, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm"
import { useLanguageStore } from "@/store/useLanguageStore"
import { ROUTES } from "@/lib/routes"

export default function SecuritySettingsPage() {
    const { t } = useLanguageStore()

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <Link 
                    href={ROUTES.private.settings}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-soft bg-surface-base text-secondary-text hover:bg-surface-elevated hover:text-primary-text transition-all"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-primary-text">
                        {t.auth.changePasswordTitle}
                    </h1>
                    <p className="text-[14px] text-secondary-text">
                        {t.auth.changePasswordSubtitle}
                    </p>
                </div>
            </div>

            <Card className="dashboard-card-xl">
                <div className="flex items-start gap-4 mb-8">
                    <div className="icon-box icon-bg-purple shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="dashboard-overline">Security</p>
                        <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-primary-text">
                            Update Password
                        </h2>
                        <p className="mt-1 text-[14px] text-secondary-text">
                            We recommend using a unique password that you don&apos;t use anywhere else.
                        </p>
                    </div>
                </div>

                <div className="max-w-md">
                    <ChangePasswordForm />
                </div>
            </Card>

            <div className="rounded-3xl border border-border-soft bg-surface-base p-6">
                <h3 className="text-[14px] font-semibold text-primary-text mb-2">Password Requirements</h3>
                <ul className="space-y-2 text-[13px] text-secondary-text">
                    <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-border-medium" />
                        Minimum 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-border-medium" />
                        At least one uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-border-medium" />
                        At least one number or special character
                    </li>
                </ul>
            </div>
        </div>
    )
}

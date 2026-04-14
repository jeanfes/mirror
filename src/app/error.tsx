"use client"

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect } from "react"
import { useLanguageStore } from "@/store/useLanguageStore";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    const { t } = useLanguageStore()

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
            <Card className="w-full p-6 text-center">
                <h1 className="text-3xl font-bold text-[#141824]">{t.app.common.globalErrorTitle}</h1>
                <p className="mt-2 text-[14px] text-slate-600">{t.app.common.globalErrorDesc}</p>
                <Button className="mt-4" onClick={reset}>{t.app.common.tryAgain}</Button>
            </Card>
        </div>
    )
}

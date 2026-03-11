"use client"

import { useEffect } from "react"
import { Button, Card } from "@/components/ui"

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
            <Card className="w-full p-6 text-center">
                <h1 className="text-3xl font-bold text-[#141824]">Unexpected error</h1>
                <p className="mt-2 text-[14px] text-slate-600">Something failed while rendering this route.</p>
                <Button className="mt-4" onClick={reset}>Try again</Button>
            </Card>
        </div>
    )
}

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
            <Card className="w-full p-6 text-center">
                <h1 className="text-3xl font-bold text-[#141824]">Page not found</h1>
                <p className="mt-2 text-[14px] text-slate-600">The route you requested does not exist in this workspace.</p>
                <Link href="/" className="mt-4 inline-block">
                    <Button>Go to home</Button>
                </Link>
            </Card>
        </div>
    )
}

import { Sparkles } from "lucide-react"
import { Button } from "../ui/Button"
import { MobileSidebar } from "./mobile-sidebar"

export function Navbar() {
    return (
        <header className="flex w-full items-center justify-between border-b border-[#E8ECF4] px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:px-6 md:py-4">
            <div className="flex items-center gap-3">
                <MobileSidebar />
                <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Mirror Workspace
                </div>
            </div>
            <div className="hidden text-center text-[13px] font-semibold text-[#1A1D26] md:block">Daily Nixtio</div>
            <div className="flex justify-end">
                <Button size="md" className="h-9 rounded-full px-4 text-[12px]">
                    Upgrade
                </Button>
            </div>
        </header>
    )
}

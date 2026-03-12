import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui"

export function Navbar() {
    return (
        <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-[#E8ECF4] px-4 py-3 md:px-6 md:py-4">
            <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
                <Sparkles className="h-3.5 w-3.5" />
                Mirror Workspace
            </div>
            <div className="text-center text-[13px] font-semibold text-[#1A1D26]">Daily Nixtio</div>
            <div className="flex justify-end">
                <Button size="md" className="h-9 rounded-full px-4 text-[12px]">
                    Upgrade
                </Button>
            </div>
        </header>
    )
}

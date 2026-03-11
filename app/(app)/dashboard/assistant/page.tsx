import { Sparkles, Wand2, MessageSquareText } from "lucide-react"
import { Card, Button } from "@/components/ui"
import { SectionHeader } from "@/components/layout/SectionHeader"

export default function AssistantPage() {
    return (
        <div>
            <SectionHeader
                eyebrow="Private"
                title="Assistant"
                description="Generate and refine comments with your preferred persona and objective in one focused workflow."
            />

            <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
                <Card className="p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Generation playground</p>
                    <textarea
                        className="mt-3 h-44 w-full rounded-[14px] border border-[#E6EAF2] bg-white p-3 text-[14px] text-slate-700 outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
                        placeholder="Paste a post snippet here and run a generation..."
                    />
                    <div className="mt-3 flex gap-2">
                        <Button>
                            <Wand2 className="h-4 w-4" />
                            Generate
                        </Button>
                        <Button variant="secondary">
                            <MessageSquareText className="h-4 w-4" />
                            Save draft
                        </Button>
                    </div>
                </Card>

                <Card className="p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Quick tips</p>
                    <ul className="mt-3 space-y-2 text-[14px] text-slate-700">
                        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8B5CF6]" /> Start with your intent, not tone.</li>
                        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8B5CF6]" /> Keep concise replies under 260 chars.</li>
                        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8B5CF6]" /> Save strong outputs as persona examples.</li>
                    </ul>
                </Card>
            </div>
        </div>
    )
}

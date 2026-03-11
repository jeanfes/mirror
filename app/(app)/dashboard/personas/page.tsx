import { Card } from "@/components/ui"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { getDashboardPersonas } from "@/lib/data-access/dashboard"

export default async function PersonasPage() {
    const { personas } = await getDashboardPersonas()

    return (
        <div>
            <SectionHeader
                eyebrow="Private"
                title="Personas"
                description="Define voice profiles to keep your style coherent in every conversation."
            />
            <div className="grid gap-4 md:grid-cols-2">
                {personas.map((persona) => (
                    <Card key={persona.id} className="p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-[#141824]">{persona.name}</h2>
                            <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                {persona.enabled ? "Enabled" : "Disabled"}
                            </span>
                        </div>
                        <p className="mt-2 text-[14px] text-slate-600">{persona.description}</p>
                        <p className="mt-3 text-[13px] text-slate-700">Tone: {persona.tone}</p>
                    </Card>
                ))}
            </div>
        </div>
    )
}

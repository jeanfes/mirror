import { Card, Button } from "@/components/ui"
import { SectionHeader } from "@/components/layout/SectionHeader"

const members = [
    { name: "Nixito", role: "Owner", status: "Active" },
    { name: "Lucia", role: "Editor", status: "Active" },
    { name: "Marcus", role: "Analyst", status: "Invited" }
]

export default function TeamPage() {
    return (
        <div>
            <SectionHeader
                eyebrow="Private"
                title="Team"
                description="Coordinate communication standards across collaborators with clear roles and shared goals."
            />

            <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Members</p>
                    <Button variant="secondary">Invite member</Button>
                </div>
                <div className="space-y-3">
                    {members.map((member) => (
                        <div key={member.name} className="flex items-center justify-between rounded-xl border border-[#E6EAF2] bg-white px-3 py-2.5">
                            <div>
                                <p className="text-[14px] font-semibold text-[#1A1D26]">{member.name}</p>
                                <p className="text-[12px] text-slate-500">{member.role}</p>
                            </div>
                            <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                {member.status}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

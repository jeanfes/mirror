import { Card, Button } from "@/components/ui"
import { SectionHeader } from "@/components/layout/SectionHeader"

export default function TrashPage() {
    return (
        <div>
            <SectionHeader
                eyebrow="Private"
                title="Trash"
                description="Review deleted drafts and personas before permanent cleanup."
            />
            <Card className="p-5">
                <p className="text-[14px] text-slate-600">Your trash is currently empty.</p>
                <Button variant="secondary" className="mt-4">Restore last deleted item</Button>
            </Card>
        </div>
    )
}

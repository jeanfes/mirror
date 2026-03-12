import { Card, Button } from "@/components/ui"

export default function TrashPage() {
    return (
        <div>
            <Card className="p-5">
                <p className="text-[14px] text-slate-600">Your trash is currently empty.</p>
                <Button variant="secondary" className="mt-4">Restore last deleted item</Button>
            </Card>
        </div>
    )
}

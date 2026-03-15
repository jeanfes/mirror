import { LoadingInline } from "@/components/ui/Loading"

export default function AuthLoading() {
    return (
        <div className="flex min-h-56 items-center justify-center">
            <LoadingInline label="Loading authentication..." />
        </div>
    )
}

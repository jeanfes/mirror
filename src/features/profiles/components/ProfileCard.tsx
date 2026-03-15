"use client"

import { formatDistanceToNow } from "date-fns"
import { Eye, EyeOff, MessageSquareQuote, MoreHorizontal, Pencil, WandSparkles, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu"
import type { Persona } from "@/types/dashboard"

interface ProfileCardProps {
    profile: Persona
    onEdit: (id: string) => void
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

export function ProfileCard({ profile, onEdit, onToggle, onDelete }: ProfileCardProps) {
    return (
        <Card className="relative overflow-hidden rounded-[28px] border border-[#E8ECF4] p-0 shadow-premium-md">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/65 to-transparent" />

            <div className="relative p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="max-w-[80%]">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E6EAF2] bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-premium-sm">
                            <WandSparkles className="h-3.5 w-3.5 text-slate-500" />
                            Voice profile
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#141824]">{profile.name}</h2>
                        <p className="mt-3 body-muted">{profile.description}</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" className="h-10 w-10 rounded-full border border-[#E8ECF4] bg-white/90 p-0" aria-label="Open profile actions">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(profile.id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onToggle(profile.id)}>
                                {profile.enabled ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                {profile.enabled ? "Disable" : "Enable"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(profile.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {profile.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <span className="rounded-full border border-[#E6EAF2] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {profile.allowEmojis ? "Emoji ready" : "No emojis"}
                    </span>
                    <span className="text-[12px] font-medium text-slate-500">Updated {formatDistanceToNow(profile.updatedAt, { addSuffix: true })}</span>
                </div>

                <div className="mt-5 rounded-3xl border border-[#E8ECF4] bg-white/75 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="dashboard-overline">Tone map</p>
                            <p className="mt-1 text-[15px] font-semibold text-[#141824]">{profile.tone}</p>
                        </div>
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8ECF4] bg-white/90">
                            <MessageSquareQuote className="h-4 w-4 text-[#141824]" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-2.5">
                    {profile.examples.map((example, index) => (
                        <div key={`${profile.id}_example_${index}`} className="rounded-2xl border border-[#E6EAF2] bg-white/80 px-3.5 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Example {index + 1}</p>
                            <p className="mt-2 text-[13px] leading-6 text-slate-700">{example}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

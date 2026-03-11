interface SectionHeaderProps {
    eyebrow?: string
    title: string
    description: string
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
    return (
        <header className="mb-6">
            {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{eyebrow}</p> : null}
            <h1 className="mt-2 text-3xl font-bold text-[#141824]">{title}</h1>
            <p className="mt-1.5 max-w-2xl text-[14px] text-slate-600">{description}</p>
        </header>
    )
}

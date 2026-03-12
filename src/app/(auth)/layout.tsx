export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full items-center px-4 py-10 md:px-6">
            <div className="neo-shell dashboard-shell w-full p-4 md:p-6">
                <div className="grid items-stretch gap-4 md:grid-cols-[1.05fr_1fr]">
                    <section className="neo-panel relative overflow-hidden p-5 md:p-6">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#D8D3F4]/55 blur-xl" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Mirror Web</p>
                        <h1 className="mt-4 text-3xl font-bold text-[#141824]">Scale your authentic voice</h1>
                        <p className="mt-3 text-[14px] text-slate-600">
                            Manage personas, monitor your history, and align your public communication strategy from one premium workspace.
                        </p>

                        <div className="mt-6 rounded-2xl border border-[#E6EAF2] bg-white/80 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">What you get</p>
                            <ul className="mt-2 space-y-1.5 text-[13px] text-slate-600">
                                <li>Focused dashboard with quick generation actions</li>
                                <li>Persona and planning modules in one private workspace</li>
                                <li>Track credits, history, and performance trends</li>
                            </ul>
                        </div>
                    </section>
                    <section className="neo-panel p-5 md:p-6">{children}</section>
                </div>
            </div>
        </div>
    )
}

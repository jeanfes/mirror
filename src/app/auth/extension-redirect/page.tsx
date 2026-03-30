"use client"

import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"
import { ShieldCheck } from "lucide-react"

function RedirectContent() {
    const searchParams = useSearchParams()
    const nextUrl = searchParams.get("next")
    const [status, setStatus] = useState("Initializing secure handshake...")

    useEffect(() => {
        const proceedToExtension = async () => {
            if (!nextUrl || !nextUrl.startsWith("chrome-extension://")) {
                setStatus("Invalid extension gateway.")
                return
            }

            const supabase = createClient()
            
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.access_token && session.user?.id) {
                const theme = session.user?.user_metadata?.theme || "light"
                const language = session.user?.user_metadata?.language || "es"
                const finalUrl = `${nextUrl}#access_token=${session.access_token}&refresh_token=${session.refresh_token || ""}&theme=${theme}&language=${language}`
                window.location.replace(finalUrl)
            } else {
                setStatus("Session expired. Redirecting to login...")
                setTimeout(() => {
                    window.location.href = `/auth/login?next=${encodeURIComponent(nextUrl)}`
                }, 1000)
            }
        }

        void proceedToExtension()
    }, [nextUrl])

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#fdfdff] dark:bg-[#050505] selection:bg-accent-purple/30 overflow-hidden px-6">
            {/* Premium Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] size-[50%] bg-accent-blue/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[50%] bg-accent-purple/10 blur-[120px] rounded-full animate-pulse delay-700" />
            
            <div className="absolute inset-x-0 bottom-0 h-100 bg-linear-to-t from-[#fdfdff] dark:from-[#050505] via-[#fdfdff]/80 dark:via-[#050505]/80 to-transparent z-1 pointer-events-none" />

            <div className="w-full max-w-115 p-1.5 pt-1.5 bg-linear-to-b from-white/30 to-transparent dark:from-white/10 dark:to-transparent rounded-[44px] shadow-premium-lg relative z-10 animate-premium-fade">
                <div className="bg-white/70 dark:bg-[#0a0a0b]/70 backdrop-blur-3xl p-12 md:p-16 flex flex-col items-center text-center border border-white/50 dark:border-white/5 rounded-[40px] saturate-[1.8] shadow-inner">
                    <div className="mb-12 relative flex items-center justify-center">
                        <div className="size-24 rounded-4xl rotate-10 absolute inset-0 bg-primary-dark blur-2xl opacity-20 animate-pulse" />
                        
                        <div className="size-20 rounded-[30px] bg-primary-dark flex items-center justify-center shadow-premium-md relative z-10 border border-white/10 overflow-hidden -rotate-6 transition-transform hover:rotate-0 duration-700">
                             <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
                             <ShieldCheck className="size-10 text-white animate-premium-fade" strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="space-y-10 w-full">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-[-0.04em] text-primary-dark dark:text-white uppercase select-none leading-none">
                                Mirror <span className="text-mirror pb-1">Sync</span>
                            </h1>
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-px w-6 bg-border-soft" />
                                <p className="text-[11px] font-black text-muted-text uppercase tracking-[0.3em] leading-none opacity-80">
                                    Authenticating
                                </p>
                                <span className="h-px w-6 bg-border-soft" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <p className="text-[16px] font-medium text-secondary-text dark:text-gray-400 leading-relaxed max-w-[320px] animate-pulse">
                                {status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand Footer */}
            <div className="fixed bottom-12 flex items-center gap-5 opacity-20 transition-all pointer-events-none hover:opacity-100 z-10 scale-95">
                <div className="size-2 bg-primary-dark dark:bg-white rounded-full scale-150 animate-pulse" />
                <span className="text-[18px] font-black uppercase tracking-[0.5em] text-primary-dark dark:text-white">Mirror</span>
                <div className="size-2 bg-primary-dark dark:bg-white rounded-full scale-150 animate-pulse delay-300" />
            </div>
        </div>
    )
}

export default function ExtensionRedirectPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-bg-main text-secondary-text">
                Cargando pasarela segura...
            </div>
        }>
            <RedirectContent />
        </Suspense>
    )
}

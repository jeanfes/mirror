import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { getServerSession } from "@/lib/auth"
import { ROUTES } from "@/lib/routes"
import * as motion from "motion/react-client"

export default async function NotFound() {
    const user = await getServerSession()
    
    const href = user ? ROUTES.private.profiles : ROUTES.public.index
    const label = user ? "Go to Mirror" : "Go to Landing"

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg-main px-4 selection:bg-primary-main/20">
            <div className="relative w-full max-w-lg">
                {/* Decorative background elements */}
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-main/5 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary-main/10 blur-3xl" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative flex flex-col items-center text-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                        className="mb-6"
                    >
                        <h1 className="bg-linear-to-b from-primary-text to-primary-text/60 bg-clip-text text-8xl font-bold tracking-tighter text-transparent sm:text-9xl">
                            404
                        </h1>
                    </motion.div>

                    <h2 className="text-2xl font-bold text-primary-text sm:text-3xl">
                        Page not found
                    </h2>
                    
                    <p className="mt-4 max-w-[320px] text-base leading-relaxed text-secondary-text">
                        The route you requested does not exist in this workspace or you might not have access.
                    </p>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-10"
                    >
                        <Link href={href}>
                            <Button size="lg" className="h-12 px-8 text-base transition-all hover:scale-105 active:scale-95">
                                {label}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

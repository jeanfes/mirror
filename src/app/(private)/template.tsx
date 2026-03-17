"use client"

import { motion, useReducedMotion } from "motion/react"

export default function PrivateTemplate({ children }: { children: React.ReactNode }) {
    const shouldReduceMotion = useReducedMotion()

    return (
        <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.05, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    )
}

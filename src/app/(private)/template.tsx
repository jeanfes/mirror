"use client"

import { motion, useReducedMotion } from "motion/react"

export default function PrivateTemplate({ children }: { children: React.ReactNode }) {
    const shouldReduceMotion = useReducedMotion()

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    )
}

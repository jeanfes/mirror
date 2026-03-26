"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export default function PrivateTemplate({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1], // Custom smooth curve
            }}
            className="h-full w-full"
        >
            {children}
        </motion.div>
    )
}

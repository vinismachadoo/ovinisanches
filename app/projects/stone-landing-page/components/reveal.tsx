"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Distance in pixels the element travels upward as it enters. */
  distance?: number
}

export function Reveal({ children, className, delay = 0, distance = 24 }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

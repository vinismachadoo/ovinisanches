"use client"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/registry/default/ui/button"
import type { ComponentProps } from "react"

type StoneTone = "green" | "ink" | "outline" | "glass"
type StoneSize = "default" | "lg"

const toneStyles: Record<StoneTone, string> = {
  green:
    "bg-stone-green-500 bg-stone-grafismo animate-stone-grafismo motion-reduce:animate-none text-stone-ink hover:brightness-108 focus-visible:border-stone-green-700 focus-visible:ring-stone-green-600/40",
  ink: "bg-stone-ink text-white hover:bg-stone-ink-soft focus-visible:ring-stone-ink/30",
  outline:
    "border-stone-ink/15 bg-white text-stone-ink shadow-xs hover:bg-stone-ink/5 focus-visible:ring-stone-ink/25",
  glass:
    "border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 focus-visible:border-white/60 focus-visible:ring-white/30",
}

/** shadcn's compact default padding, widened for standalone marketing calls to action. */
const sizeStyles: Record<StoneSize, string> = {
  default: "px-4",
  lg: "px-6 text-base",
}

export function StoneButton({
  tone = "green",
  size = "default",
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "size" | "variant"> & {
  tone?: StoneTone
  size?: StoneSize
}) {
  return (
    <Button
      size={size}
      className={cn("touch-manipulation", sizeStyles[size], toneStyles[tone], className)}
      {...props}
    />
  )
}

export function StoneLink({
  tone = "green",
  size = "default",
  className,
  ...props
}: ComponentProps<"a"> & { tone?: StoneTone; size?: StoneSize }) {
  return (
    <a
      className={cn(
        buttonVariants({ size }),
        "touch-manipulation",
        sizeStyles[size],
        toneStyles[tone],
        className
      )}
      {...props}
    />
  )
}

import { cn } from "@/lib/utils"
import Image from "next/image"
import type { ReactNode } from "react"

export { StoneButton, StoneLink } from "./buttons"

export function Wordmark({
  className,
  tone = "light",
}: {
  className?: string
  tone?: "light" | "dark"
}) {
  return (
    <span
      className={cn("flex items-center gap-2 leading-none", className)}
      translate="no"
    >
      <Image
        src="/stone-entrega/wordmark.png"
        alt="Stone"
        width={456}
        height={120}
        priority
        className="h-5 w-auto"
      />
      {/* <span
        aria-hidden
        className={cn("h-4 w-px", tone === "light" ? "bg-white/25" : "bg-stone-ink/20")}
      /> */}
      <span
        className={cn(
          "text-lg font-medium tracking-tight lowercase",
          tone === "light" ? "text-white/75" : "text-stone-ink/70"
        )}
      >
        entrega
      </span>
    </span>
  )
}

export function Kicker({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase",
        tone === "light" ? "text-stone-green-300" : "text-stone-green-700",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-stone-green-500" />
      {children}
    </span>
  )
}

/** Ultra-condensed uppercase display type, mirroring Stone's poster-style headlines. */
export function DisplayHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode
  className?: string
  as?: "h1" | "h2" | "h3"
}) {
  return (
    <Tag
      className={cn(
        "font-stone-display uppercase [word-spacing:0.08em]",
        "leading-[0.88] tracking-[-0.01em]",
        // Section default: same size + centered across the landing. Hero/entrar override via className.
        "text-center text-[clamp(1.85rem,4.2vw,3.25rem)] text-balance whitespace-normal",
        // The global base layer forces `text-sm` on every element, so nested accent spans
        // need to be told explicitly to take the heading's own size.
        "[&_span]:text-[length:inherit]",
        className
      )}
    >
      {children}
    </Tag>
  )
}

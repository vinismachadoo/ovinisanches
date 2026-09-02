import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
}

/** CSS marquee adapted from @shadcn-space/marquee-02. */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex gap-(--gap) overflow-hidden [--duration:40s]",
        vertical ? "flex-col" : "flex-row",
        pauseOnHover && "[&:hover_.stone-marquee-track]:paused",
        className
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "stone-marquee-track flex shrink-0 justify-around gap-(--gap)",
            vertical
              ? "animate-stone-marquee-vertical flex-col"
              : "animate-stone-marquee-x flex-row",
            reverse && "direction-[reverse]",
            "motion-reduce:animate-none"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

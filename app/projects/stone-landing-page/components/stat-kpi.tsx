"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const STONE_MESH_COLORS = ["#161a1d", "#055f04", "#00cc2c", "#29f446"]

const MESH_VARIANTS = [
  { rotation: 18, offsetX: 0.14, offsetY: -0.2, frame: 1600 },
  { rotation: 208, offsetX: -0.18, offsetY: 0.12, frame: 4100 },
  { rotation: 94, offsetX: 0.1, offsetY: 0.22, frame: 2700 },
  { rotation: 312, offsetX: -0.22, offsetY: -0.1, frame: 5300 },
] as const

type StatKpiProps = {
  value: string
  label: string
  index: number
  className?: string
}

export function StatKpi({ value, label, index, className }: StatKpiProps) {
  const cellRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()
  const variant = MESH_VARIANTS[index % MESH_VARIANTS.length]

  useEffect(() => {
    const cell = cellRef.current
    if (!cell) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin: "240px" }
    )

    observer.observe(cell)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cellRef}
      onPointerEnter={() => {
        setMounted(true)
        setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      className={cn(
        "relative isolate flex min-h-36 flex-col items-center justify-center overflow-hidden px-4 py-10 text-center sm:min-h-44 lg:min-h-56 lg:py-14",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-500 ease-out motion-reduce:transition-none",
          hovered ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="absolute inset-0 bg-stone-ink" />
        {mounted ? (
          <MeshGradient
            className="absolute inset-0 size-full"
            width="100%"
            height="100%"
            colors={STONE_MESH_COLORS}
            speed={hovered && !reduceMotion ? 0.45 : 0}
            distortion={0.85}
            swirl={0.28}
            grainMixer={0.22}
            grainOverlay={0.16}
            scale={1.15}
            rotation={variant.rotation}
            offsetX={variant.offsetX}
            offsetY={variant.offsetY}
            frame={variant.frame}
            fit="cover"
            minPixelRatio={1}
            maxPixelCount={280 * 224 * 2}
          />
        ) : null}
      </span>

      <dt className="sr-only">{label}</dt>
      <dd className="relative z-10">
        <span
          className={cn(
            "block font-stone-display text-[clamp(2.75rem,6vw,5.5rem)] leading-none transition-colors duration-500",
            hovered ? "text-white" : "text-stone-ink"
          )}
        >
          {value}
        </span>
        <span
          className={cn(
            "mt-3 block text-sm transition-colors duration-500",
            hovered ? "text-white" : "text-stone-ink/55"
          )}
        >
          {label}
        </span>
      </dd>
    </div>
  )
}

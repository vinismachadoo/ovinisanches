"use client"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/reui/icon-tile"
import { Check } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import { parseAsStringLiteral, useQueryState } from "nuqs"
import { useRef } from "react"
import { segments } from "../data/content"
import { DisplayHeading } from "./brand"
import { Reveal } from "./reveal"

const segmentIds = segments.items.map((item) => item.id) as [string, ...string[]]

export function Segments() {
  const [activeId, setActiveId] = useQueryState(
    "segmento",
    parseAsStringLiteral(segmentIds).withDefault(segmentIds[0]).withOptions({ history: "replace" })
  )
  const reduceMotion = useReducedMotion()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const active = Math.max(
    0,
    segments.items.findIndex((item) => item.id === activeId)
  )
  const current = segments.items[active]

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!offset) return
    event.preventDefault()
    const next = (active + offset + segments.items.length) % segments.items.length
    setActiveId(segments.items[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="segmentos" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-[90rem] px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <DisplayHeading className="text-stone-ink">
              {segments.title}
            </DisplayHeading>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-stone-ink/65 mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
              {segments.description}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Segmentos de negócio"
            onKeyDown={handleKeyDown}
            className="border-stone-ink/8 inline-flex flex-wrap justify-center gap-1 rounded-lg border bg-white p-1.5"
          >
            {segments.items.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                type="button"
                id={`tab-${item.id}`}
                aria-selected={active === index}
                aria-controls={`painel-${item.id}`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "focus-visible:ring-stone-green-600 relative touch-manipulation rounded-md px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  active === index ? "text-stone-ink" : "text-stone-ink/60 hover:text-stone-ink/85"
                )}
              >
                {active === index && (
                  <motion.span
                    layoutId="segmento-ativo"
                    className="bg-stone-green-500 absolute inset-0 rounded-md"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
                <span className="relative">{item.name}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2} distance={32}>
          <div className="border-stone-ink/8 mt-8 overflow-hidden rounded-2xl border bg-white">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                id={`painel-${current.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${current.id}`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-64 lg:min-h-[26rem]">
                  <Image
                    src={current.photo}
                    alt={current.photoAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <div className="from-stone-ink/70 absolute inset-0 bg-gradient-to-t from-0% to-transparent to-45% lg:bg-gradient-to-r lg:from-transparent lg:to-transparent" />
                  <div className="absolute bottom-5 left-5 lg:hidden">
                    <p className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
                      {current.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                  <h3 className="text-stone-ink text-2xl font-semibold tracking-tight sm:text-3xl">
                    {current.headline}
                  </h3>
                  <p className="text-stone-ink/65 mt-3.5 text-base leading-relaxed text-pretty">
                    {current.description}
                  </p>

                  <ul className="mt-7 space-y-3.5">
                    {current.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <IconTile variant="frame" size="xs" aria-hidden="true">
                          <Check strokeWidth={3} />
                        </IconTile>
                        <span className="text-stone-ink/75 text-base leading-snug">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-stone-mist mt-9 flex items-center gap-4 rounded-2xl px-5 py-4">
                    <span className="font-stone-display text-stone-green-700 text-4xl leading-none">
                      {current.stat.value}
                    </span>
                    <span className="text-stone-ink/65 text-sm leading-snug text-pretty">
                      {current.stat.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

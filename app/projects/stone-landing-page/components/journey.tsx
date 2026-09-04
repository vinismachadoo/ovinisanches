"use client"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"
import { journey } from "../data/content"
import { DisplayHeading } from "./brand"
import { Reveal } from "./reveal"

const STEP_MS = 1800

export function Journey() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const total = journey.steps.length

  useEffect(() => {
    if (reduceMotion) return
    const timer = setInterval(() => {
      setActive((value) => (value + 1) % total)
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [reduceMotion, total])

  return (
    <section id="jornada" className="scroll-mt-28 py-16">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <DisplayHeading className="text-stone-ink">
            {journey.title}
          </DisplayHeading>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-stone-ink/65">
            {journey.description}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-stone-ink/10 bg-white p-4 shadow-[0_40px_90px_-60px_rgba(32,37,42,0.55)] sm:p-8">
            <JourneyDiagram active={active} onSelect={setActive} />

            <ol className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {journey.steps.map((step, index) => {
                const done = index < active
                const current = index === active
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        "grid w-full gap-1 rounded-xl border border-stone-ink/10 p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-stone-green-600/40 focus-visible:outline-none",
                        current && "border-stone-green-500 bg-stone-green-50",
                        done && !current && "bg-stone-mist",
                        !done &&
                          !current &&
                          "bg-white hover:border-stone-ink/25"
                      )}
                    >
                      <span
                        className={cn(
                          "font-stone-display text-lg leading-none",
                          current ? "text-stone-green-700" : "text-stone-ink/35"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-snug font-medium",
                          current ? "text-stone-ink" : "text-stone-ink/65"
                        )}
                      >
                        {step.label}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div
              id="rastrear"
              className="mt-6 scroll-mt-28 rounded-xl border border-stone-ink/8 bg-stone-mist px-4 py-3 text-sm"
            >
              <span className="font-semibold text-stone-ink">
                {journey.steps[active].label}
              </span>
              <span className="text-stone-ink/55">
                {" "}
                · etapa {active + 1} de {total}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function JourneyDiagram({
  active,
  onSelect,
}: {
  active: number
  onSelect: (index: number) => void
}) {
  const nodes = journey.steps.map((_, index) => {
    const col = index % 4
    const row = Math.floor(index / 4)
    return {
      x: 80 + col * 213.333,
      y: 70 + row * 160,
      index,
    }
  })

  const pathD = [
    `M ${nodes[0].x} ${nodes[0].y}`,
    `L ${nodes[1].x} ${nodes[1].y}`,
    `L ${nodes[2].x} ${nodes[2].y}`,
    `L ${nodes[3].x} ${nodes[3].y}`,
    // Drop to the mid-gap, run left, then drop into step 5 — avoids landing on step 8.
    `L ${nodes[3].x} ${(nodes[3].y + nodes[4].y) / 2}`,
    `L ${nodes[4].x} ${(nodes[3].y + nodes[4].y) / 2}`,
    `L ${nodes[4].x} ${nodes[4].y}`,
    `L ${nodes[5].x} ${nodes[5].y}`,
    `L ${nodes[6].x} ${nodes[6].y}`,
    `L ${nodes[7].x} ${nodes[7].y}`,
  ].join(" ")

  const packagePos = nodes[active]

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <svg
        viewBox="0 0 800 300"
        className="h-auto w-full"
        role="img"
        aria-label="Diagrama animado da jornada do pedido na Stone Entrega"
      >
        <defs>
          <linearGradient
            id="stone-journey-line"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#00cc2c" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#00cc2c" stopOpacity="1" />
            <stop offset="100%" stopColor="#00cc2c" stopOpacity="0.25" />
          </linearGradient>
          <filter id="stone-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={pathD}
          fill="none"
          stroke="#20252a"
          strokeOpacity="0.08"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={pathD}
          fill="none"
          stroke="url(#stone-journey-line)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="12 10"
          className="animate-stone-journey-dash motion-reduce:animate-none"
        />

        {nodes.map((node) => {
          const done = node.index < active
          const current = node.index === active
          return (
            <g key={node.index}>
              <circle
                cx={node.x}
                cy={node.y}
                r={current ? 22 : 18}
                fill={current || done ? "#00cc2c" : "#f7fff9"}
                stroke={current || done ? "#009420" : "#20252a"}
                strokeOpacity={current || done ? 1 : 0.18}
                strokeWidth="2"
                className="cursor-pointer transition-[r] duration-300"
                onClick={() => onSelect(node.index)}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="pointer-events-none select-none"
                fontSize="13"
                fontWeight="700"
                fill={current || done ? "#20252a" : "#20252a99"}
              >
                {node.index + 1}
              </text>
              <foreignObject
                x={node.x - 70}
                y={node.y + 28}
                width="140"
                height="56"
              >
                <p
                  className={cn(
                    "text-center text-[11px] leading-tight font-medium",
                    current ? "text-stone-ink" : "text-stone-ink/55"
                  )}
                >
                  {journey.steps[node.index].label}
                </p>
              </foreignObject>
            </g>
          )
        })}

        <g
          filter="url(#stone-glow)"
          transform={`translate(${packagePos.x} ${packagePos.y - 42})`}
          style={{ transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <rect x="-14" y="-10" width="28" height="22" rx="4" fill="#20252a" />
          <path d="M-14 0 H14" stroke="#00eb33" strokeWidth="2" />
          <path d="M0 -10 V12" stroke="#00eb33" strokeWidth="2" />
          <circle cx="0" cy="-16" r="3" fill="#00cc2c">
            <animate
              attributeName="opacity"
              values="1;0.35;1"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  )
}

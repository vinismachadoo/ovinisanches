import { cn } from "@/lib/utils"
import { stats } from "../data/content"
import { DisplayHeading } from "./brand"
import { Reveal } from "./reveal"
import { StatKpi } from "./stat-kpi"

const markClassName =
  "pointer-events-none absolute z-10 bg-white px-1 font-black leading-none select-none"

export function Stats() {
  return (
    <section id="stats" className="scroll-mt-28 bg-white py-16">
      <div className="mx-auto max-w-[90rem] px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <DisplayHeading className="text-stone-ink">
              {stats.title}
            </DisplayHeading>
          </Reveal>
          {/* <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-stone-ink/65">
              {stats.description}
            </p>
          </Reveal> */}
        </div>

        <Reveal delay={0.16}>
          <div className="relative mt-16 border border-stone-ink/12">
            <GridMark className="top-0 left-0 -translate-x-1/2 -translate-y-1/2">
              +
            </GridMark>
            <GridMark className="top-0 right-0 translate-x-1/2 -translate-y-1/2">
              +
            </GridMark>
            <GridMark className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2">
              +
            </GridMark>
            <GridMark className="right-0 bottom-0 translate-x-1/2 translate-y-1/2">
              +
            </GridMark>

            <GridMark className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              +
            </GridMark>
            <GridMark className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              +
            </GridMark>
            <GridMark className="top-1/2 left-0 hidden -translate-x-1/2 -translate-y-1/2 max-lg:block">
              +
            </GridMark>
            <GridMark className="top-1/2 right-0 hidden translate-x-1/2 -translate-y-1/2 max-lg:block">
              +
            </GridMark>

            <GridMark className="top-0 left-1/4 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
              +
            </GridMark>
            <GridMark className="top-0 left-3/4 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
              +
            </GridMark>
            <GridMark className="bottom-0 left-1/4 hidden -translate-x-1/2 translate-y-1/2 lg:block">
              +
            </GridMark>
            <GridMark className="bottom-0 left-3/4 hidden -translate-x-1/2 translate-y-1/2 lg:block">
              +
            </GridMark>

            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {stats.items.map((stat, index) => (
                <StatKpi
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  index={index}
                  className={cn(
                    "border-stone-ink/12",
                    index % 2 === 0 && "border-r",
                    index < 2 && "border-b lg:border-b-0",
                    index < 3 && "lg:border-r"
                  )}
                />
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function GridMark({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <span aria-hidden className={cn(markClassName, className)}>
      {children}
    </span>
  )
}

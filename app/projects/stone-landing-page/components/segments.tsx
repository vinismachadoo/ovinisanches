"use client"

import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/registry/default/ui/carousel"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { parseAsStringLiteral, useQueryState } from "nuqs"
import { useEffect, useRef, useState } from "react"
import { segments } from "../data/content"
import { DisplayHeading, StoneLink } from "./brand"
import { Reveal } from "./reveal"

const segmentIds = segments.items.map((item) => item.id) as [
  string,
  ...string[],
]

const numberTones = [
  "text-stone-green-700",
  "text-stone-green-500",
  "text-stone-ink/30",
]

const arrowClassName = "static size-11 translate-y-0"

export function Segments() {
  const [activeId, setActiveId] = useQueryState(
    "segmento",
    parseAsStringLiteral(segmentIds)
      .withDefault(segmentIds[0])
      .withOptions({ history: "replace" })
  )
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const initialId = useRef(activeId)

  useEffect(() => {
    if (!api) return

    const initial = segments.items.findIndex(
      (item) => item.id === initialId.current
    )
    if (initial > 0) api.scrollTo(initial, true)

    const onSelect = () => {
      const index = api.selectedScrollSnap()
      setSelected(index)
      setActiveId(segments.items[index].id)
    }

    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, setActiveId])

  return (
    <section
      id="segmentos"
      className="relative scroll-mt-28 overflow-hidden py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.7),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-[90rem] px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <DisplayHeading className="text-stone-ink">
              {segments.title}
            </DisplayHeading>
          </Reveal>
        </div>

        <Carousel
          opts={{ loop: true }}
          setApi={setApi}
          aria-label="Cases por segmento"
          className="mt-6"
        >
          <Reveal delay={0.16} distance={32}>
            <CarouselContent>
              {segments.items.map((item) => (
                <CarouselItem key={item.id}>
                  <article className="grid h-full gap-2 overflow-hidden rounded-2xl border border-stone-ink/8 bg-white p-2 sm:gap-3 sm:p-3 lg:grid-cols-2">
                    <div className="flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                      <p className="text-xs font-semibold tracking-[0.18em] text-stone-green-700 uppercase">
                        {item.kicker}
                      </p>

                      <h3 className="mt-5 max-w-lg text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-stone-ink sm:text-4xl">
                        {item.headline}
                      </h3>

                      <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-stone-ink/60">
                        {item.description}
                      </p>

                      <ol className="mt-9 max-w-lg divide-y divide-stone-ink/10 border-t border-stone-ink/10">
                        {item.bullets.map((bullet, index) => (
                          <li
                            key={bullet.text}
                            className="flex items-baseline gap-4 py-4"
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "font-stone-display text-lg tabular-nums",
                                numberTones[index % numberTones.length]
                              )}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-base leading-snug text-stone-ink/75">
                              {bullet.highlight && (
                                <strong className="font-semibold text-stone-green-700">
                                  {bullet.highlight}{" "}
                                </strong>
                              )}
                              {bullet.text}
                            </span>
                          </li>
                        ))}
                      </ol>

                      <div className="mt-9">
                        <StoneLink href={item.caseHref} className="group/case">
                          {segments.caseCta}
                          <ArrowRight className="size-4 transition-transform group-hover/case:translate-x-0.5" />
                        </StoneLink>
                      </div>
                    </div>

                    <div className="relative order-first min-h-64 overflow-hidden rounded-xl lg:order-last lg:min-h-[32rem]">
                      <Image
                        src={item.photo}
                        alt={item.photoAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        className="object-cover"
                      />
                      <p className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-stone-ink backdrop-blur-sm">
                        {item.name}
                      </p>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Reveal>

          <Reveal
            delay={0.2}
            className="mt-8 flex items-center justify-center gap-6"
          >
            <CarouselPrevious className={arrowClassName} />

            <div className="flex items-center gap-2">
              {segments.items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ver o case de ${item.name}`}
                  aria-current={selected === index ? "true" : undefined}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 touch-manipulation rounded-full transition-all focus-visible:ring-2 focus-visible:ring-stone-green-600 focus-visible:outline-none",
                    selected === index
                      ? "w-7 bg-stone-green-500"
                      : "w-2 bg-stone-ink/15 hover:bg-stone-ink/30"
                  )}
                />
              ))}
            </div>

            <CarouselNext className={arrowClassName} />
          </Reveal>
        </Carousel>
      </div>
    </section>
  )
}

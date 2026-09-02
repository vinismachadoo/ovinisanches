import { ArrowRight, Check, Sparkles } from "lucide-react"
import Image from "next/image"
import { hero } from "../data/content"
import { DisplayHeading, StoneLink } from "./brand"
import { Reveal } from "./reveal"

export function Hero() {
  return (
    <section
      id="topo"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <Image
        src={hero.backdrop}
        alt={hero.backdropAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[62%_center]"
      />

      {/* Left-to-right scrim keeps the headline legible while the shopkeeper stays visible.
          Narrow screens skip it: the column is too tight to hide the photo behind solid ink. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-linear-to-r from-stone-ink/85 via-stone-ink/60 to-transparent sm:block"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-stone-ink/85 via-stone-ink/60 to-black/55"
      />

      <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center p-26 px-6 pb-12">
        <div className="mx-auto w-full max-w-[90rem]">
          <div className="max-w-5xl">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-md border border-white/20 bg-white/10 py-2 pr-5 pl-2 text-sm font-medium text-white/85 backdrop-blur-md">
                <span className="inline-flex items-center gap-1 rounded-sm bg-stone-green-500 px-2.5 py-1 text-xs font-bold text-stone-ink">
                  <Sparkles aria-hidden className="size-3.5" />
                  Novidade
                </span>
                {hero.badge}
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <DisplayHeading
                as="h1"
                className="mt-12 text-left text-[clamp(3.5rem,9vw,7.25rem)] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              >
                <span className="block leading-none text-stone-green-400">
                  {hero.titleAccent}
                </span>
                <span className="mt-4 block leading-none text-white">
                  {hero.titleRest}
                </span>
              </DisplayHeading>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-white/85 sm:text-xl">
                {hero.description}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <StoneLink href="#simular" size="lg">
                  {hero.primaryCta}
                  <ArrowRight aria-hidden className="size-4" />
                </StoneLink>
                <StoneLink href="#atendimento" tone="glass" size="lg">
                  {hero.secondaryCta}
                </StoneLink>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80">
                {hero.reassurance.map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-sm">
                    <Check
                      aria-hidden
                      className="size-4 text-stone-green-400"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

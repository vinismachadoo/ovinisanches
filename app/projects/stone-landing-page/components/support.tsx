import { cn } from "@/lib/utils"
import { PhoneCall } from "lucide-react"
import { support } from "../data/content"
import { DisplayHeading } from "./brand"
import { Reveal } from "./reveal"

export function Support() {
  return (
    <section id="atendimento" className="scroll-mt-28 px-4 py-16 sm:px-6">
      <div className="relative mx-auto max-w-[90rem] overflow-hidden rounded-2xl bg-stone-ink px-6 py-16 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full bg-radial from-stone-green-500/25 from-0% to-transparent to-70% blur-2xl"
        />

        <div className="relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="text-center lg:text-left">
            <Reveal>
              <DisplayHeading className="text-white">
                {support.title}
              </DisplayHeading>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/60 lg:mx-0">
                {support.description}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-3">
                {support.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-l-2 border-white/15 pl-4"
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-stone-display text-3xl leading-none text-white">
                        {stat.value}
                      </span>
                      <span className="mt-2 block text-sm leading-snug text-white/50">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.14} distance={32}>
            <div className="rounded-xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-5">
                <span className="grid size-24 shrink-0 place-items-center rounded-full bg-stone-green-500/12 ring-1 ring-stone-green-500/30 sm:size-28">
                  <span className="font-stone-display text-5xl leading-none text-stone-green-400 sm:text-6xl">
                    {support.highlight.value}
                    <span className="text-3xl sm:text-4xl">
                      {support.highlight.unit}
                    </span>
                  </span>
                </span>
                <div>
                  <p className="text-base leading-snug font-semibold text-pretty text-white">
                    {support.highlight.label}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-stone-green-400">
                    <PhoneCall aria-hidden className="size-3.5" />
                    Telefone, WhatsApp e chat
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-2.5 border-t border-white/10 pt-7">
                {support.conversation.map((message, index) => (
                  <p
                    key={index}
                    className={cn(
                      "max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      message.from === "you"
                        ? "rounded-tl-sm bg-white/8 text-white/70"
                        : "ml-auto rounded-tr-sm bg-stone-green-500 font-medium text-stone-ink"
                    )}
                  >
                    {message.text}
                  </p>
                ))}
                <p className="pt-2 text-right text-xs text-white/50">
                  Resolvido em 1 min 12 s
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { join } from "../data/content"
import { DisplayHeading, StoneLink } from "./brand"
import { Reveal } from "./reveal"

export function Join() {
  return (
    <section id="cadastro" className="scroll-mt-28">
      <div className="relative overflow-hidden bg-stone-green-50 px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.7),transparent_55%)]"
        />

        <div className="relative mx-auto max-w-[90rem] text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3">
              <ul className="flex -space-x-3">
                {join.avatars.map((avatar, avatarIndex) => (
                  <li key={avatar}>
                    <Image
                      src={avatar}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover ring-3 ring-stone-green-50"
                      style={{ zIndex: join.avatars.length - avatarIndex }}
                    />
                  </li>
                ))}
              </ul>
              <span className="text-sm font-semibold text-stone-ink/85">
                +{join.count} negócios ativos
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <DisplayHeading className="mt-8 text-stone-ink">
              Junte-se aos {join.count} {join.title}
            </DisplayHeading>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-stone-ink/85">
              {join.description}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <StoneLink
                href="/projects/stone-landing-page/entrar"
                tone="ink"
                size="lg"
              >
                {join.primaryCta}
                <ArrowRight aria-hidden className="size-4" />
              </StoneLink>
              <StoneLink
                href="#atendimento"
                tone="outline"
                size="lg"
                className="border-stone-ink/20 bg-white hover:border-stone-ink/45 hover:bg-white"
              >
                {join.secondaryCta}
              </StoneLink>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="w-full bg-white py-10 sm:py-14">
        <Reveal delay={0.08}>
          <ul className="grid w-full gap-px bg-stone-ink/8 sm:grid-cols-2 xl:grid-cols-4">
            {join.testimonials.map((item) => (
              <li
                key={item.author}
                className="bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-10"
              >
                <figure>
                  <blockquote className="text-base leading-relaxed text-pretty text-stone-ink sm:text-lg">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Image
                      src={item.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-stone-ink">
                        {item.author}
                      </p>
                      <p className="text-sm text-stone-ink/65">{item.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

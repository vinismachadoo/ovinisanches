"use client"

import Image from "next/image"
import { useState } from "react"
import { brands } from "../data/content"
import { DisplayHeading } from "./brand"
import { Marquee } from "./marquee"
import { Reveal } from "./reveal"

export function Brands() {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal>
          <DisplayHeading className="text-stone-ink">
            Marcas que entregam com a Stone
          </DisplayHeading>
        </Reveal>
      </div>

      <Reveal delay={0.08} className="relative mt-10 sm:mt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent sm:w-28"
        />

        <div className="flex flex-col divide-y divide-dashed divide-stone-ink/15 border-t border-b border-dashed border-stone-ink/15">
          <Marquee pauseOnHover className="p-0 [--duration:50s] [--gap:0rem]">
            {brands.map((brand) => (
              <BrandLogo
                key={`a-${brand.domain}`}
                name={brand.name}
                domain={brand.domain}
              />
            ))}
          </Marquee>

          <Marquee
            reverse
            pauseOnHover
            className="p-0 [--duration:55s] [--gap:0rem]"
          >
            {brands.map((brand) => (
              <BrandLogo
                key={`b-${brand.domain}`}
                name={brand.name}
                domain={brand.domain}
              />
            ))}
          </Marquee>
        </div>
      </Reveal>
    </section>
  )
}

function BrandLogo({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="group/logo flex size-40 shrink-0 items-center justify-center border-r border-dashed border-stone-ink/15 bg-white sm:size-48 md:size-64">
      {failed ? (
        <span className="text-center font-stone-display text-base tracking-wide text-stone-ink/40 uppercase transition-colors group-hover/logo:text-stone-ink sm:text-lg">
          {name}
        </span>
      ) : (
        <Image
          src={`https://logo.uplead.com/${domain}`}
          alt={name}
          width={200}
          height={80}
          unoptimized
          onError={() => setFailed(true)}
          className="h-20 w-auto max-w-40 object-contain opacity-55 grayscale transition duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 sm:h-24 sm:max-w-40 md:h-28 md:max-w-40"
        />
      )}
    </div>
  )
}

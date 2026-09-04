"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { integrations } from "../data/content"
import { DisplayHeading } from "./brand"
import { Reveal } from "./reveal"

/**
 * The board is a 6x10 grid on small screens and a 12x5 grid from `lg` up, always
 * 60 cells. Marks stay on the perimeter so the headline in the middle is legible.
 */
const cells: Record<string, string> = {
  "vtex.com": "col-start-1 row-start-1 lg:col-start-1 lg:row-start-1",
  "shopify.com": "col-start-3 row-start-1 lg:col-start-4 lg:row-start-1",
  "nuvemshop.com.br": "col-start-5 row-start-1 lg:col-start-7 lg:row-start-1",
  "tray.com.br": "col-start-1 row-start-2 lg:col-start-10 lg:row-start-1",
  "linx.com.br": "col-start-5 row-start-2 lg:col-start-12 lg:row-start-1",
  "plugg.to": "col-start-3 row-start-3 lg:col-start-12 lg:row-start-2",
  "intelipost.com.br": "col-start-1 row-start-4 lg:col-start-1 lg:row-start-2",
  "bling.com.br": "col-start-5 row-start-4 lg:col-start-12 lg:row-start-4",
  "yampi.com.br": "col-start-1 row-start-8 lg:col-start-1 lg:row-start-4",
  "wbuy.com.br": "col-start-5 row-start-8 lg:col-start-2 lg:row-start-5",
  "claude.ai": "col-start-3 row-start-9 lg:col-start-5 lg:row-start-5",
  "baselinker.com": "col-start-1 row-start-10 lg:col-start-8 lg:row-start-5",
  "abbiamolog.com": "col-start-5 row-start-10 lg:col-start-11 lg:row-start-5",
}

const gridShape = "grid grid-cols-6 grid-rows-10 lg:grid-cols-12 lg:grid-rows-5"

export function Integrations() {
  return (
    <section id="integracoes" className="scroll-mt-28 bg-white py-16">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal>
          <div className="relative isolate h-[40rem] overflow-hidden rounded-2xl bg-white sm:h-[42rem] lg:aspect-12/5 lg:h-auto">
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 mask-[linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]",
                gridShape
              )}
            >
              {Array.from({ length: 60 }, (_, index) => (
                <div
                  key={index}
                  className={cn(
                    "border-b border-dashed border-stone-ink/12",
                    (index + 1) % 12 !== 0 && "border-r"
                  )}
                />
              ))}
            </div>

            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,white_26%,transparent_68%)]"
            />

            <div className={cn("absolute inset-0", gridShape)}>
              {integrations.items.map((item) => (
                <IntegrationLogo
                  key={item.domain}
                  name={item.name}
                  domain={item.domain}
                  className={cells[item.domain]}
                />
              ))}

              <div className="col-span-6 col-start-1 row-span-3 row-start-5 flex flex-col items-center justify-center px-5 text-center lg:col-span-10 lg:col-start-2 lg:row-span-3 lg:row-start-2">
                <DisplayHeading className="w-full text-stone-ink">
                  {integrations.titleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </DisplayHeading>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const faviconUrl = (domain: string) =>
  `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=https://${domain}`

function IntegrationLogo({
  name,
  domain,
  className,
}: {
  name: string
  domain: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        "group/logo col-span-2 flex items-center justify-center p-1.5 lg:col-span-1",
        className
      )}
    >
      {failed ? (
        <span className="text-center font-stone-display text-sm tracking-wide text-stone-ink/45 uppercase">
          {name}
        </span>
      ) : (
        <Image
          src={faviconUrl(domain)}
          alt={name}
          title={name}
          width={128}
          height={128}
          unoptimized
          onError={() => setFailed(true)}
          className="size-10 rounded-xl object-contain opacity-80 transition duration-300 group-hover/logo:scale-110 group-hover/logo:opacity-100 lg:size-12"
        />
      )}
    </div>
  )
}

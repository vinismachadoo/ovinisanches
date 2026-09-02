"use client"

import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { nav } from "../data/content"
import { StoneLink, Wordmark } from "./brand"

const linkFocus =
  "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-stone-ink"

/** Frosted pane: translucent ink tint, heavy blur and a lit top edge so the photo shows through.
    The tint stays dark enough that white labels keep contrast over the light sections too. */
const glass =
  "bg-stone-ink/85 supports-[backdrop-filter]:bg-stone-ink/70 backdrop-blur-2xl backdrop-saturate-150"

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Navegação principal"
        className={cn(
          glass,
          "mx-auto max-w-[90rem] overflow-hidden rounded-xl shadow-[0_20px_60px_-35px_rgba(0,0,0,0.9)] ring-1 ring-white/15",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-white/40 before:to-transparent",
          "relative"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-6 px-5 sm:px-6">
          <a href="#topo" className={cn(linkFocus, "touch-manipulation rounded-md")} translate="no">
            <Wordmark />
            <span className="sr-only">Stone Entrega, página inicial</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    linkFocus,
                    "rounded-md px-3.5 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="/projects/stone-landing-page/entrar"
              className={cn(
                linkFocus,
                "rounded-md px-3.5 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
              )}
            >
              Entrar
            </a>
            <StoneLink href="#simular">{nav.cta}</StoneLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className={cn(
              linkFocus,
              "grid size-10 touch-manipulation place-items-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
            )}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>

        <div id="menu-mobile" hidden={!open} className="border-t border-white/15 px-5 pt-4 pb-5 lg:hidden">
          <ul className="flex flex-col gap-1">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    linkFocus,
                    "block touch-manipulation rounded-md px-3 py-2.5 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2">
            <StoneLink href="#simular" size="lg" onClick={() => setOpen(false)}>
              {nav.cta}
            </StoneLink>
            <StoneLink
              href="/projects/stone-landing-page/entrar"
              tone="glass"
              size="lg"
              onClick={() => setOpen(false)}
            >
              Entrar
            </StoneLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

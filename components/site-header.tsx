"use client"

import LocaleSwitcher from "@/components/locale-switcher"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import ModeToggle from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-[calc(var(--main-banner-height)+var(--main-nav-height))] w-full border-b bg-background">
      <div className="flex h-(--main-nav-height) items-center px-4 **:data-[slot=separator]:h-4! sm:px-20">
        <MobileNav className="flex lg:hidden" />
        <MainNav className="hidden lg:flex" />

        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <LocaleSwitcher />
          <ModeToggle size="icon-sm" />
        </div>
      </div>
    </header>
  )
}

"use client"

import LocaleSwitcher from "@/components/locale-switcher"
import ModeToggle from "@/components/mode-toggle"
import { Button } from "@/registry/default/ui/button"
import { Citrus } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MainNav = () => {
  const pathname = usePathname()
  const t = useTranslations("main-nav")

  return (
    <nav className="flex h-full w-full items-center justify-between gap-x-2 border-b px-20 **:data-active:bg-muted">
      <div className="flex items-center gap-x-2">
        <Link href="/">
          <div className="hit-area-2 extend-touch-target mr-2 flex size-6 items-center justify-center rounded-sm bg-lime-300 dark:bg-lime-800">
            <Citrus className="size-4" />
          </div>
        </Link>

        <Button variant="ghost" size="sm" data-active={pathname === "/resume"}>
          <Link href="/resume">{t("resume")}</Link>
        </Button>

        <Button variant="ghost" size="sm" data-active={pathname === "/pitch"}>
          <Link href="/pitch">{t("pitch")}</Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          data-active={pathname === "/world-map"}
        >
          <Link href="/world-map">{t("world-map")}</Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled
          data-active={pathname === "/writing"}
        >
          <Link href="/writing">{t("writing")}</Link>
        </Button>
      </div>

      <div className="flex items-center gap-x-2">
        <LocaleSwitcher />

        <ModeToggle />
      </div>
    </nav>
  )
}

export default MainNav

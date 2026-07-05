"use client"

import React from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/registry/default/ui/button"
import { Globe } from "lucide-react"
import { setLocaleCookie } from "@/app/actions/locale"

const LOCALES = ["en", "pt-br"] as const
type Locale = (typeof LOCALES)[number]

const LocaleSwitcher = () => {
  const locale = useLocale() as Locale
  const router = useRouter()

  const handleLocaleSwitch = React.useCallback(async () => {
    await setLocaleCookie(locale === "en" ? "pt-br" : "en")
    router.refresh()
  }, [locale, router])

  return (
    <Button variant="ghost" onClick={handleLocaleSwitch} className="text-xs">
      <Globe className="size-3" />
      {locale === "en" ? "EN-US" : "PT-BR"}
    </Button>
  )
}

export default LocaleSwitcher

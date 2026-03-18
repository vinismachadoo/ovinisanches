import { useTheme } from "next-themes"
import React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip"
import { Button } from "@/registry/default/ui/button"
import { SunIcon, Moon } from "lucide-react"
import { Kbd } from "@/registry/default/ui/kbd"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const ModeToggle = ({
  className,
  variant = "ghost",
  size = "icon",
  shortcut = null,
  ...props
}: React.ComponentProps<typeof Button> & { shortcut?: string | null }) => {
  const t = useTranslations("main-nav")

  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            onClick={toggleTheme}
            variant={variant}
            size={size}
            {...props}
            className={className}
          />
        }
      >
        <SunIcon className="hidden size-4 dark:block" />
        <Moon className="block size-4 dark:hidden" />
        <span className="sr-only">{t("toggle-theme")}</span>
      </TooltipTrigger>
      <TooltipContent
        className={cn("flex items-center gap-2", shortcut && "pe-2")}
      >
        {t("toggle-theme")}
        {shortcut && <Kbd className="uppercase">{shortcut}</Kbd>}
      </TooltipContent>
    </Tooltip>
  )
}

export default ModeToggle

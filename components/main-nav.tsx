"use client"

import { Button } from "@/registry/default/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Citrus } from "lucide-react"

const MainNav = ({
  className,
  ...props
}: React.ComponentProps<"div"> & { className?: string }) => {
  const pathname = usePathname()
  const t = useTranslations("main-nav")

  return (
    <div
      className={cn(
        "flex items-center gap-x-2 **:data-active:bg-muted",
        className
      )}
      {...props}
    >
      <Link href="/">
        <div className="hit-area-2 extend-touch-target mr-2 flex size-6 items-center justify-center rounded-sm bg-lime-300 dark:text-background">
          <Citrus className="size-4" />
        </div>
      </Link>
    </div>
  )
}

const NewDot = () => {
  return <div className="h-2 w-2 shrink-0 rounded-full bg-lime-500" />
}

export { MainNav }

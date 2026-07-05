"use client"

import Link, { type LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { BookIcon, CitrusIcon, MailIcon, Menu, XIcon } from "lucide-react"

function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("extend-touch-target touch-manipulation", className)}
          />
        }
      >
        <Menu className={cn(open ? "hidden" : "block")} />
        <XIcon className={cn(open ? "block" : "hidden")} />

        <span className="sr-only">Toggle Menu</span>
      </PopoverTrigger>
      <PopoverContent
        className="no-scrollbar h-(--available-height) w-(--available-width) gap-0 overflow-y-auto p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={14}
      >
        <MobileLink href="/" onOpenChange={setOpen}>
          <CitrusIcon />
          Portfólio
        </MobileLink>

        <MobileLink href="/blog" onOpenChange={setOpen} disabled>
          <BookIcon />
          Blog
        </MobileLink>

        <MobileLink href="/contato" onOpenChange={setOpen} disabled>
          <MailIcon />
          Contato
        </MobileLink>
      </PopoverContent>
    </Popover>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  disabled,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}) {
  const router = useRouter()
  return (
    <div className="flex w-full p-1">
      <Link
        href={href}
        onClick={() => {
          router.push(href.toString())
          onOpenChange?.(false)
        }}
        className={cn("flex w-full items-center gap-2", className)}
        {...props}
      >
        <Button variant="ghost" disabled={disabled}>
          {children}
        </Button>
      </Link>
    </div>
  )
}

const NewDot = () => {
  return <div className="h-2 w-2 shrink-0 rounded-full bg-lime-500" />
}

export { MobileNav }

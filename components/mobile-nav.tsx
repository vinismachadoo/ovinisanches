"use client"

import Link, { type LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { cn } from "@/lib/utils"
import { Menu, XIcon } from "lucide-react"
import { Separator } from "@/registry/default/ui/separator"

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
        className="no-scrollbar w-(--available-width) gap-0 overflow-y-auto p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        sideOffset={14}
      >
        <MobileLink href="/" onOpenChange={setOpen}>
          O Café
        </MobileLink>

        <Separator />

        <MobileLink href="/reservar" onOpenChange={setOpen}>
          Reservar
        </MobileLink>

        <Separator />

        <MobileLink href="/compartilhar" onOpenChange={setOpen}>
          Compartilhar
        </MobileLink>

        {/* <db.SignedIn>
          <MobileLink href={!user ? "/" : "/admin"} onOpenChange={setOpen}>
            Admin
          </MobileLink>
          <Separator />
        </db.SignedIn> */}
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
        <Button
          variant="ghost"
          disabled={disabled}
          className="w-full justify-start"
        >
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

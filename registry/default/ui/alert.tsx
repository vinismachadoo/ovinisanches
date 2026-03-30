import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
        info: cn(
          "border-(--info-border) bg-(--info-bg) text-(--info-text) *:data-[slot=alert-description]:text-(--info-text)/90",
          "dark:border-(--info-border-dark) dark:bg-(--info-bg-dark) dark:text-(--info-text-dark) dark:*:data-[slot=alert-description]:text-(--info-text-dark)/90"
        ),
        error: cn(
          "border-(--error-border) bg-(--error-bg) text-(--error-text) *:data-[slot=alert-description]:text-(--error-text)/90",
          "dark:border-(--error-border-dark) dark:bg-(--error-bg-dark) dark:text-(--error-text-dark) dark:*:data-[slot=alert-description]:text-(--error-text-dark)/90"
        ),
        success: cn(
          "border-(--success-border) bg-(--success-bg) text-(--success-text) *:data-[slot=alert-description]:text-(--success-text)/90",
          "dark:border-(--success-border-dark) dark:bg-(--success-bg-dark) dark:text-(--success-text-dark) dark:*:data-[slot=alert-description]:text-(--success-text-dark)/90"
        ),
        warning: cn(
          "border-(--warning-border) bg-(--warning-bg) text-(--warning-text) *:data-[slot=alert-description]:text-(--warning-text)/90",
          "dark:border-(--warning-border-dark) dark:bg-(--warning-bg-dark) dark:text-(--warning-text-dark) dark:*:data-[slot=alert-description]:text-(--warning-text-dark)/90"
        ),
        normal: cn(
          "border-(--normal-border) bg-(--normal-bg) text-(--normal-text) *:data-[slot=alert-description]:text-(--normal-text)/90",
          "dark:border-(--normal-border-dark) dark:bg-(--normal-bg-dark) dark:text-(--normal-text-dark) dark:*:data-[slot=alert-description]:text-(--normal-text-dark)/90"
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      style={
        {
          "--normal-bg": "#fff",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--foreground)",
          "--success-bg": "hsl(143, 85%, 96%)",
          "--success-border": "hsl(145, 92%, 87%)",
          "--success-text": "hsl(140, 100%, 27%)",
          "--info-bg": "hsl(208, 100%, 97%)",
          "--info-border": "hsl(221, 91%, 93%)",
          "--info-text": "hsl(210, 92%, 45%)",
          "--warning-bg": "hsl(49, 100%, 97%)",
          "--warning-border": "hsl(49, 91%, 84%)",
          "--warning-text": "hsl(31, 92%, 45%)",
          "--error-bg": "hsl(359, 100%, 97%)",
          "--error-border": "hsl(359, 100%, 94%)",
          "--error-text": "hsl(360, 100%, 45%)",
          "--normal-bg-dark": "#000",
          "--normal-border-dark": "hsl(0, 0%, 20%)",
          "--normal-text-dark": "var(--foreground)",
          "--success-bg-dark": "hsl(150, 100%, 6%)",
          "--success-border-dark": "hsl(147, 100%, 12%)",
          "--success-text-dark": "hsl(150, 86%, 65%)",
          "--info-bg-dark": "hsl(215, 100%, 6%)",
          "--info-border-dark": "hsl(223, 43%, 17%)",
          "--info-text-dark": "hsl(216, 87%, 65%)",
          "--warning-bg-dark": "hsl(64, 100%, 6%)",
          "--warning-border-dark": "hsl(60, 100%, 9%)",
          "--warning-text-dark": "hsl(46, 87%, 65%)",
          "--error-bg-dark": "hsl(358, 76%, 10%)",
          "--error-border-dark": "hsl(357, 89%, 16%)",
          "--error-text-dark": "hsl(358, 100%, 81%)",
        } as React.CSSProperties
      }
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }

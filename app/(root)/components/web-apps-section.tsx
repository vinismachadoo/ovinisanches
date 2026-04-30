import { cn } from "@/lib/utils"
import { Beer, Check, Circle, Folder, type LucideIcon } from "lucide-react"
import Link from "next/link"
import React from "react"

const WEB_APPS = [
  {
    url: "https://botecada.vercel.app",
    icon: Beer,
    name: "Botecada",
    className:
      "[--color-dark:var(--color-yellow-800)] [--color-light:var(--color-yellow-300)]",
    disabled: false,
  },
  {
    url: "https://checked-nu.vercel.app/",
    icon: Check,
    name: "Checked",
    className:
      "[--color-dark:var(--color-blue-600)] [--color-light:var(--color-blue-600)] [&_svg[data-icon='inset-lucide-folder']]:stroke-white",
    disabled: false,
  },
]

const WebApps = () => {
  return (
    <div className="grid w-full grid-cols-9">
      {WEB_APPS.map((webApp) => (
        <Link
          href={webApp.url}
          target="_blank"
          rel="noopener noreferrer"
          key={webApp.name}
        >
          <FolderComponent
            icon={webApp.icon}
            name={webApp.name}
            className={webApp.className}
            aria-disabled={webApp.disabled}
          />
        </Link>
      ))}
    </div>
  )
}

interface FolderComponentProps extends React.ComponentProps<"div"> {
  icon: LucideIcon
  name: string
}

const FolderComponent = ({
  className,
  icon: Icon,
  name,
  ...props
}: FolderComponentProps) => {
  return (
    <div
      className={cn(
        "relative flex size-32 shrink-0 flex-col items-center justify-center gap-y-0 text-(--color-light) transition-colors dark:text-(--color-dark)",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Folder className="size-32 fill-current stroke-0" />
      <div className="absolute inset-1/2 size-6 -translate-x-1/2 -translate-y-1/2">
        <Icon
          data-icon="inset-lucide-folder"
          className="size-full stroke-foreground stroke-2"
        />
      </div>

      <div className="-mt-2 flex min-w-0 items-center justify-center gap-x-1.5">
        <Circle
          className="size-2 shrink-0 fill-current text-current"
          aria-hidden
        />
        <span className="truncate text-center text-sm font-medium text-foreground">
          {name}
        </span>
      </div>
    </div>
  )
}

export default WebApps

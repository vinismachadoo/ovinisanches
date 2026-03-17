import { cn } from "@/lib/utils"
import {
  Circle,
  FlaskConical,
  Folder,
  LineSquiggle,
  Projector,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import React from "react"

const Projects = () => {
  return (
    <div className="grid w-full grid-cols-8 gap-4">
      <Link
        href="https://labs.ovinisanches.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FolderComponent
          icon={FlaskConical}
          name="Labs"
          className="[--color-dark:var(--color-purple-800)] [--color-light:var(--color-purple-300)]"
        />
      </Link>

      <Link
        href="https://motionvg.ovinisanches.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FolderComponent
          icon={LineSquiggle}
          name="Motionvg"
          className="[--color-dark:var(--color-slate-800)] [--color-light:var(--color-slate-300)]"
        />
      </Link>

      <Link
        href="https://presentcn.ovinisanches.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FolderComponent
          icon={Projector}
          name="presentcn"
          className="[--color-dark:var(--color-sky-800)] [--color-light:var(--color-sky-300)]"
        />
      </Link>

      <FolderComponent
        icon={FlaskConical}
        name="json-forms"
        className="[--color-dark:var(--color-rose-800)] [--color-light:var(--color-rose-300)]"
        aria-disabled
      />

      <FolderComponent
        icon={FlaskConical}
        name="Charttier"
        className="[--color-dark:var(--color-yellow-800)] [--color-light:var(--color-yellow-300)]"
        aria-disabled
      />
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
        <Icon className="size-full stroke-foreground stroke-2" />
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

export default Projects

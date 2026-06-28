import { cn } from "@/lib/utils"
import {
  Braces,
  Circle,
  FlaskConical,
  Folder,
  Grip,
  LineSquiggle,
  Projector,
  Satellite,
  SquareDashedKanban,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import React from "react"

const PROJECTS = [
  {
    url: "https://geoposter.ovinisanches.com",
    icon: Satellite,
    name: "GeoPoster",
    className:
      "[--color-dark:var(--color-taupe-800)] [--color-light:var(--color-taupe-300)]",
  },
  {
    url: "https://dbforms-rho.vercel.app/",
    icon: Braces,
    name: "dbforms",
    className:
      "[--color-dark:var(--color-rose-800)] [--color-light:var(--color-rose-300)]",
  },
  {
    url: "https://charttier.ovinisanches.com",
    icon: SquareDashedKanban,
    name: "Charttier",
    className:
      "[--color-dark:var(--color-orange-800)] [--color-light:var(--color-orange-300)] [&_svg[data-icon='inset-lucide-folder']]:rotate-180",
    disabled: true,
  },
]

const Projects = () => {
  return (
    <div className="grid w-full grid-cols-9">
      {PROJECTS.map((project) => (
        <Link
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          key={project.name}
        >
          <FolderComponent
            icon={project.icon}
            name={project.name}
            className={project.className}
            aria-disabled={project.disabled}
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

export default Projects

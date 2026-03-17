import { cn } from "@/lib/utils"
import {
  Circle,
  FlaskConical,
  Folder,
  Grip,
  LineSquiggle,
  Projector,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import React from "react"

const PROJECTS = [
  {
    url: "https://labs.ovinisanches.com",
    icon: FlaskConical,
    name: "Labs",
    className:
      "[--color-dark:var(--color-purple-800)] [--color-light:var(--color-purple-300)]",
  },
  {
    url: "https://motionvg.ovinisanches.com",
    icon: LineSquiggle,
    name: "Motionvg",
    className:
      "[--color-dark:var(--color-slate-800)] [--color-light:var(--color-slate-300)]",
  },

  {
    url: "https://presentcn.ovinisanches.com",
    icon: Projector,
    name: "presentcn",
    className:
      "[--color-dark:var(--color-sky-800)] [--color-light:var(--color-sky-300)]",
  },
  {
    url: "https://heatmap-tracker.ovinisanches.com",
    icon: Grip,
    name: "Heatmap Tracker",
    className:
      "[--color-dark:var(--color-emerald-800)] [--color-light:var(--color-emerald-300)]",
  },
  {
    url: "https://json-forms.ovinisanches.com",
    icon: FlaskConical,
    name: "json-forms",
    className:
      "[--color-dark:var(--color-rose-800)] [--color-light:var(--color-rose-300)]",
    disabled: true,
  },
  {
    url: "https://charttier.ovinisanches.com",
    icon: FlaskConical,
    name: "Charttier",
    className:
      "[--color-dark:var(--color-yellow-800)] [--color-light:var(--color-yellow-300)]",
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

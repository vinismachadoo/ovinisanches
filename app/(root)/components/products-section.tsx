import { cn } from "@/lib/utils"
import { Beer, Circle, Folder, type LucideIcon } from "lucide-react"
import Link from "next/link"
import React from "react"

const PRODUCTS = [
  {
    url: "https://botecada.vercel.app",
    icon: Beer,
    name: "Botecada",
    className:
      "[--color-dark:var(--color-yellow-800)] [--color-light:var(--color-yellow-300)]",
    disabled: false,
  },
]

const Products = () => {
  return (
    <div className="grid w-full grid-cols-9">
      {PRODUCTS.map((product) => (
        <Link
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          key={product.name}
        >
          <FolderComponent
            icon={product.icon}
            name={product.name}
            className={product.className}
            aria-disabled={product.disabled}
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

export default Products

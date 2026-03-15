/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from "@/registry/default/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import * as React from "react"

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export const stringToColorSoft = (str: string) => {
  const stringUniqueHash = String(str)
    .split("")
    .reduce((acc, char) => {
      return char.charCodeAt(0) + (acc << 10) - acc * 2.5
    }, 0)
  const hash = stringUniqueHash % 360
  const hue = hash < 0 ? 360 - hash : hash
  const value = hslToHex(hue, 80, 80)

  return value
}

function hexToHSL(H: string) {
  // Convert hex to RGB first
  let r = 0
  let g = 0
  let b = 0
  if (H.length === 4) {
    //@ts-ignore
    r = "0x" + H[1] + H[1]
    //@ts-ignore
    g = "0x" + H[2] + H[2]
    //@ts-ignore
    b = "0x" + H[3] + H[3]
  } else if (H.length === 7) {
    //@ts-ignore
    r = "0x" + H[1] + H[2]
    //@ts-ignore
    g = "0x" + H[3] + H[4]
    //@ts-ignore
    b = "0x" + H[5] + H[6]
  }
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin

  let h = 0
  let s = 0
  let l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  if (h < 0) h += 360

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return { h, s, l }
}

interface SellerChipProps extends React.HTMLAttributes<HTMLDivElement> {
  baseStringToColor: string
  unselectAction?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
  truncate?: boolean
}

const SellerChip = React.forwardRef<HTMLDivElement, SellerChipProps>(
  (
    {
      className,
      children,
      baseStringToColor,
      unselectAction,
      truncate = true,
      ...props
    },
    ref
  ) => {
    const hasOnValueChange = !!unselectAction
    const chipBaseColor = stringToColorSoft(baseStringToColor)
    const { h, s, l } = hexToHSL(chipBaseColor)

    return (
      <div
        ref={ref}
        style={
          {
            "--brand-darker-50": `hsl(${h} ${s}% calc(${l}% - 50%))`,
            "--brand-darker-5": `hsl(${h} ${s}% calc(${l}% - 5%))`,
            "--brand-lighter-15": `hsl(${h} ${s}% calc(${l}% + 15%))`,
          } as React.CSSProperties
        }
        className={cn(
          "inline-flex h-fit w-fit max-w-[200px] items-center rounded-sm border px-1.5 py-0.5 font-medium",
          "border-(--brand-darker-5) bg-(--brand-lighter-15) text-(--brand-darker-50)",
          truncate && "max-w-[200px]",
          hasOnValueChange && "gap-x-2",
          className
        )}
        {...props}
      >
        <span className={cn("text-xs", truncate && "truncate")}>
          {children}
        </span>
        {hasOnValueChange ? (
          <Button
            variant="ghost"
            className="group p-0 hover:bg-(--brand-lighter-15) hover:text-(--brand-darker-50)"
            type="button"
          >
            <X
              className="h-3 w-3 group-hover:text-(--brand-darker-50)"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                unselectAction(e)
              }}
            />
          </Button>
        ) : null}
      </div>
    )
  }
)
SellerChip.displayName = "SellerChip"

export default SellerChip

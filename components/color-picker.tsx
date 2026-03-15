import * as React from "react"
import { HexColorPicker } from "react-colorful"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { Button } from "@/registry/default/ui/button"
import { Circle } from "lucide-react"
import { isValidHexColor } from "@/lib/swatch-generator"

interface ColorPickerProps {
  value?: string
  defaultColor?: string
  onValueChange(value: string): void
  colorOptions?: string[] | undefined
  disabled?: boolean
  className?: string
  popoverContentClassName?: string
  colorPickerClassname?: string
  deselectable?: boolean
}

const ColorPicker = ({
  colorOptions = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
  ],
  defaultColor,
  value = "#000000",
  onValueChange,
  disabled,
  className,
  popoverContentClassName,
  colorPickerClassname,
}: ColorPickerProps) => {
  const displayColor = (
    value && value.length ? value : defaultColor || "#000000"
  ).toUpperCase()
  const [open, setOpen] = React.useState<boolean>(false)

  const isHexColor = isValidHexColor(displayColor)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            size="icon"
            variant="ghost"
            className={cn("size-7", className)}
          />
        }
      >
        <Circle
          className={cn(
            "size-5 rounded-full border fill-(--fill) text-(--color)",
            !isHexColor && "border-dashed fill-transparent text-transparent"
          )}
          style={
            {
              "--color": displayColor,
              "--fill": displayColor,
            } as React.CSSProperties
          }
        />
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className={cn(
          "w-fit max-w-xs rounded-md border-0 p-2",
          popoverContentClassName
        )}
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            {colorOptions?.map((colorOption, colorIdx) => {
              return (
                <Button
                  key={colorIdx}
                  size="icon"
                  variant="outline"
                  className={cn(
                    "size-7 p-0.5",
                    displayColor === colorOption && "border-(--selected-color)"
                  )}
                  style={
                    {
                      "--selected-color": displayColor,
                    } as React.CSSProperties
                  }
                  onClick={() => onValueChange(colorOption.toUpperCase())}
                >
                  <div
                    className="aspect-square w-full rounded-sm"
                    style={{ backgroundColor: colorOption }}
                  />
                </Button>
              )
            })}
          </div>
          <HexColorPicker
            color={displayColor}
            onChange={(color) => onValueChange(color.toUpperCase())}
            className={cn("w-full!", colorPickerClassname)}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker

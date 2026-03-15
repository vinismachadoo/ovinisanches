import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { Button } from "@/registry/default/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import { Separator } from "@/registry/default/ui/separator"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/registry/default/ui/command"

interface MultiSelectProps {
  id?: string
  className?: string
  contentClassName?: string
  contentAlign?: "end" | "center" | "start" | undefined
  value: string[]
  title?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyState?: React.ReactNode
  onChange: (value: string[]) => void
  options: Array<{
    value: string
    label: React.ReactNode
  }>
  disabled?: boolean
}

const MultiSelect = ({
  onChange,
  options,
  value,
  title,
  placeholder = "",
  searchPlaceholder = "Pesquisar...",
  emptyState = "Nenhum resultado",
  className,
  contentClassName,
  contentAlign = "end",
  id,
  disabled,
}: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false)
  const selectedValues = new Set(
    options
      .filter((option) => value.includes(option.value))
      .map((v) => v.value) as string[]
  )
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((v) => v.label)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("h-auto w-[200px] justify-between", className)}
            disabled={disabled}
          />
        }
      >
        {title}
        {selectedLabels?.length > 0 && (
          <React.Fragment>
            {title && <Separator orientation="vertical" className="h-4" />}
            <div className="hidden space-x-1 lg:flex">
              {selectedLabels.length > 1 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal whitespace-nowrap"
                >
                  {selectedLabels.length} selecionados
                </Badge>
              ) : (
                selectedLabels
              )}
            </div>
          </React.Fragment>
        )}
        {selectedLabels?.length === 0 && placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[200px] p-0", contentClassName)}
        align={contentAlign}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyState}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedValues.has(option.value)
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (value.includes(option.value)) {
                      onChange(value.filter((v) => v !== option.value))
                    } else {
                      onChange([...value, option.value])
                    }
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("size-4")} />
                  </div>
                  {option.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
          <div className="sticky bottom-0 bg-background">
            <CommandSeparator />
            <CommandGroup>
              <div className="flex w-full items-center justify-center gap-x-2 p-1">
                <Button
                  onClick={() => {
                    onChange([])
                  }}
                  disabled={selectedValues.size === 0}
                  variant="outline"
                >
                  Limpar
                </Button>
                <Button
                  onClick={() => {
                    onChange(options.map((o) => o.value))
                  }}
                  disabled={selectedValues.size === options.length}
                  className="whitespace-nowrap"
                >
                  Aplicar todos
                </Button>
              </div>
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }

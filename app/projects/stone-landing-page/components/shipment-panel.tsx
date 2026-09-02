import { cn } from "@/lib/utils"
import { IconTile } from "@/components/reui/icon-tile"
import { Check, Truck } from "lucide-react"
import { shipment } from "../data/content"

export function ShipmentPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-stone-ink/8 bg-white p-5 shadow-[0_30px_70px_-50px_rgba(32,37,42,0.5)]",
        className
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-lg font-semibold text-stone-ink">#{shipment.code}</p>
        <p className="text-xs text-stone-ink/65">{shipment.destination}</p>
      </div>

      <ol className="mt-5 space-y-0">
        {shipment.steps.map((step, index) => {
          const isLast = index === shipment.steps.length - 1
          return (
            <li key={step.label} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full",
                    step.done
                      ? "bg-stone-green-500 text-stone-ink"
                      : "border-2 border-dashed border-stone-ink/15 bg-white"
                  )}
                >
                  {step.done && (
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  )}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "w-0.5 flex-1",
                      step.done ? "bg-stone-green-200" : "bg-stone-ink/10"
                    )}
                  />
                )}
              </div>
              <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-5")}>
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      step.done ? "text-stone-ink" : "text-stone-ink/65"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="shrink-0 text-xs text-stone-ink/65 tabular-nums">
                    {step.time}
                  </p>
                </div>
                <p className="truncate text-xs text-stone-ink/65">
                  {step.place}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 flex items-center gap-3 rounded-lg bg-stone-mist px-4 py-3">
        <IconTile variant="frame" size="sm" aria-hidden="true">
          <Truck />
        </IconTile>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-ink">{shipment.eta}</p>
          <p className="text-xs text-stone-ink/65">
            {shipment.recipient} recebe aviso por SMS na saída para entrega
          </p>
        </div>
      </div>
    </div>
  )
}

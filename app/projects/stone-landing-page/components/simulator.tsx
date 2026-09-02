"use client"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/reui/icon-tile"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/registry/default/ui/field"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import { RadioGroup, RadioGroupItem } from "@/registry/default/ui/radio-group"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  LoaderCircle,
  LocateFixed,
  Truck,
  Zap,
} from "lucide-react"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import {
  packageSizes,
  simulator,
  type PackageSize,
  type QuoteOption,
} from "../data/content"
import { brl, estimateDistanceKm, priceFor } from "../data/quote"
import { DisplayHeading, StoneButton, StoneLink } from "./brand"
import { Reveal } from "./reveal"
import { ShipmentPanel } from "./shipment-panel"

type GeoState = "idle" | "loading" | "error"

export function Simulator() {
  const [step, setStep] = useState(0)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [packageSize, setPackageSize] = useState<PackageSize>("medio")
  const [geo, setGeo] = useState<GeoState>("idle")
  const [bidding, setBidding] = useState(false)
  const [selected, setSelected] = useState<QuoteOption["id"]>("turbo")

  const originId = useId()
  const destinationId = useId()
  const geoStatusId = useId()

  const distanceKm = estimateDistanceKm(origin, destination)
  const sizeMeta =
    packageSizes.find((item) => item.id === packageSize) ?? packageSizes[1]
  const chosen =
    simulator.options.find((option) => option.id === selected) ??
    simulator.options[0]

  const priced = useMemo(
    () =>
      simulator.options.map((option) => ({
        option,
        price: priceFor(option, distanceKm, sizeMeta.multiplier),
      })),
    [distanceKm, sizeMeta.multiplier]
  )

  const cheapestId = useMemo(
    () =>
      priced.reduce((best, item) => (item.price < best.price ? item : best))
        .option.id,
    [priced]
  )
  const fastestId = useMemo(
    () =>
      simulator.options.reduce((best, option) =>
        option.etaHours < best.etaHours ? option : best
      ).id,
    []
  )

  useEffect(() => {
    if (step !== 1 || !bidding) return
    const timer = setTimeout(() => setBidding(false), 2200)
    return () => clearTimeout(timer)
  }, [step, bidding])

  const didMountStep = useRef(false)
  useEffect(() => {
    if (!didMountStep.current) {
      didMountStep.current = true
      return
    }
    const node = document.querySelector<HTMLElement>(
      `[data-sim-step="${step}"]`
    )
    node?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [step])

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeo("error")
      return
    }
    setGeo("loading")
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const fallback = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&accept-language=pt-BR`
          )
          const data = await response.json()
          const a = data?.address ?? {}
          const line = [
            [a.road, a.house_number].filter(Boolean).join(", "),
            a.suburb ?? a.neighbourhood,
            a.city ?? a.town ?? a.municipality,
            a.state_code ?? a.state,
          ]
            .filter(Boolean)
            .join(" — ")
          setOrigin(line || fallback)
        } catch {
          setOrigin(fallback)
        }
        setGeo("idle")
      },
      () => setGeo("error"),
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  }

  function startAuction() {
    setBidding(true)
    setStep(1)
  }

  const canQuote = origin.trim().length > 3 && destination.trim().length > 3
  const step0Active = step === 0
  const step1Active = step === 1
  const step2Active = step === 2

  return (
    <section id="simular" className="scroll-mt-28 bg-white py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Reveal>
          <DisplayHeading className="text-stone-ink">
            {simulator.title}
          </DisplayHeading>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-stone-ink/10 bg-stone-mist p-2 sm:p-3">
            <Stepper current={step} />

            <div className="grid min-h-[40rem] gap-3 max-lg:snap-x max-lg:snap-mandatory max-lg:auto-cols-[minmax(17.5rem,82vw)] max-lg:grid-flow-col max-lg:overflow-x-auto max-lg:pb-2 lg:grid-cols-3 lg:items-stretch lg:gap-4">
              <StepColumn
                index={0}
                current={step}
                title={simulator.steps[0].name}
                className="max-lg:snap-center"
              >
                <fieldset
                  disabled={!step0Active}
                  className="flex h-full min-h-0 flex-col disabled:pointer-events-none"
                >
                  <form
                    className="flex h-full flex-col gap-5"
                    onSubmit={(event) => {
                      event.preventDefault()
                      if (!step0Active || !canQuote) return
                      startAuction()
                    }}
                  >
                    <div className="grid gap-2">
                      <Label htmlFor={originId}>Endereço de coleta</Label>
                      <Input
                        id={originId}
                        required
                        value={origin}
                        onChange={(event) => setOrigin(event.target.value)}
                        placeholder="Rua, número, bairro e cidade"
                        autoComplete="street-address"
                      />
                      <button
                        type="button"
                        onClick={useCurrentLocation}
                        disabled={geo === "loading" || !step0Active}
                        aria-describedby={
                          geo === "error" ? geoStatusId : undefined
                        }
                        className="inline-flex w-fit touch-manipulation items-center gap-1.5 rounded-md text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-60"
                      >
                        {geo === "loading" ? (
                          <LoaderCircle
                            aria-hidden
                            className="size-4 animate-spin motion-reduce:animate-none"
                          />
                        ) : (
                          <LocateFixed aria-hidden className="size-4" />
                        )}
                        {geo === "loading"
                          ? "Buscando localização…"
                          : "Usar minha localização atual"}
                      </button>
                      <p
                        id={geoStatusId}
                        role="status"
                        className="text-xs text-muted-foreground"
                      >
                        {geo === "error" &&
                          "Não consegui acessar sua localização. Digite o endereço de coleta."}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={destinationId}>Endereço de entrega</Label>
                      <Input
                        id={destinationId}
                        required
                        value={destination}
                        onChange={(event) => setDestination(event.target.value)}
                        placeholder="Onde o seu cliente recebe"
                        autoComplete="off"
                      />
                    </div>

                    <FieldSet>
                      <FieldLegend variant="label">
                        Tamanho do pacote
                      </FieldLegend>
                      <RadioGroup
                        value={packageSize}
                        disabled={!step0Active}
                        onValueChange={(value) => {
                          if (value) setPackageSize(value as PackageSize)
                        }}
                      >
                        {packageSizes.map((size) => (
                          <FieldLabel
                            key={size.id}
                            htmlFor={`pacote-${size.id}`}
                          >
                            <Field orientation="horizontal">
                              <RadioGroupItem
                                value={size.id}
                                id={`pacote-${size.id}`}
                                disabled={!step0Active}
                              />
                              <FieldContent>
                                <FieldTitle>{size.label}</FieldTitle>
                                <FieldDescription>{size.hint}</FieldDescription>
                              </FieldContent>
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                    </FieldSet>

                    <div className="mt-auto flex flex-col gap-3">
                      <StoneButton
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!step0Active || !canQuote}
                      >
                        Ver ofertas
                        <ArrowRight aria-hidden className="size-4" />
                      </StoneButton>
                    </div>
                  </form>
                </fieldset>
              </StepColumn>

              <StepColumn
                index={1}
                current={step}
                title={simulator.steps[1].name}
                className="max-lg:snap-center"
              >
                <div
                  className={cn(
                    "flex h-full flex-col gap-4",
                    !step1Active && "pointer-events-none"
                  )}
                >
                  {bidding && step1Active ? (
                    <Auction />
                  ) : (
                    <div
                      role="radiogroup"
                      aria-label="Opções de entrega"
                      aria-disabled={!step1Active}
                      className="grid gap-2.5"
                    >
                      {priced.map(({ option, price }) => (
                        <OptionCard
                          key={option.id}
                          option={option}
                          price={price}
                          checked={selected === option.id}
                          cheapest={option.id === cheapestId}
                          fastest={option.id === fastestId}
                          disabled={!step1Active}
                          onSelect={() => setSelected(option.id)}
                        />
                      ))}
                    </div>
                  )}

                  <div
                    className={cn(
                      "mt-auto flex flex-col gap-3",
                      bidding && step1Active && "invisible"
                    )}
                  >
                    <StoneButton
                      size="lg"
                      className="w-full"
                      disabled={!step1Active || bidding}
                      onClick={() => setStep(2)}
                    >
                      Continuar com {chosen.name}
                      <ArrowRight aria-hidden className="size-4" />
                    </StoneButton>
                    <StoneButton
                      size="lg"
                      tone="outline"
                      className="w-full"
                      disabled={!step1Active || bidding}
                      onClick={() => setStep(0)}
                    >
                      <ArrowLeft aria-hidden className="size-4" />
                      Voltar
                    </StoneButton>
                  </div>
                </div>
              </StepColumn>

              <StepColumn
                index={2}
                current={step}
                title={simulator.steps[2].name}
                className="max-lg:snap-center"
              >
                <div
                  className={cn(
                    "flex h-full flex-col gap-5",
                    !step2Active && "pointer-events-none"
                  )}
                >
                  <div className="grid gap-3 rounded-xl border border-stone-green-200 bg-stone-green-50 p-4">
                    <div className="flex items-start gap-3">
                      <IconTile
                        variant="frame"
                        size="default"
                        aria-hidden="true"
                      >
                        {chosen.id === "turbo" ? <Zap /> : <Truck />}
                      </IconTile>
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-ink">
                          {chosen.carrier} {chosen.name}
                        </p>
                        <p className="text-sm text-stone-ink/65">
                          {chosen.eta} · pacote {sizeMeta.label.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <p className="font-stone-display text-4xl leading-none text-stone-ink">
                      {brl.format(
                        priceFor(chosen, distanceKm, sizeMeta.multiplier)
                      )}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-stone-ink/65">
                    Falta só a sua conta Stone. O cadastro leva alguns minutos,
                    não tem mensalidade e a simulação fica salva para você
                    confirmar a coleta.
                  </p>

                  <div className="grid gap-2">
                    <p className="text-xs font-semibold tracking-[0.16em] text-stone-ink/65 uppercase">
                      Depois de criada
                    </p>
                    <ShipmentPanel />
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <StoneLink
                      size="lg"
                      className={cn(
                        "w-full",
                        !step2Active && "pointer-events-none opacity-60"
                      )}
                      aria-disabled={!step2Active}
                      tabIndex={!step2Active ? -1 : undefined}
                      href={`/projects/stone-landing-page/entrar?frete=${chosen.id}&de=${encodeURIComponent(origin)}&para=${encodeURIComponent(destination)}&pacote=${packageSize}`}
                    >
                      Criar entrega
                      <ArrowRight aria-hidden className="size-4" />
                    </StoneLink>
                    <StoneButton
                      size="lg"
                      tone="outline"
                      className="w-full"
                      disabled={!step2Active}
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft aria-hidden className="size-4" />
                      Ver outras ofertas
                    </StoneButton>
                  </div>
                </div>
              </StepColumn>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StepColumn({
  index,
  current,
  title,
  className,
  children,
}: {
  index: number
  current: number
  title: string
  className?: string
  children: React.ReactNode
}) {
  const active = index === current
  const done = index < current

  return (
    <div
      data-sim-step={index}
      className={cn(
        "flex h-full min-h-[40rem] flex-col rounded-xl border bg-white p-5 transition-[box-shadow,border-color,opacity] sm:p-6",
        active &&
          "border-stone-green-500 shadow-[0_24px_50px_-40px_rgba(0,148,32,0.55)]",
        done && "border-stone-ink/10",
        !active && "border-stone-ink/8 opacity-45",
        className
      )}
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-md text-xs font-bold",
            done && "bg-stone-green-500 text-stone-ink",
            active && "bg-stone-ink text-white",
            !done && !active && "bg-stone-ink/8 text-stone-ink/65"
          )}
        >
          {done ? (
            <Check aria-hidden className="size-3.5" strokeWidth={3} />
          ) : (
            index + 1
          )}
        </span>
        <p
          aria-current={active ? "step" : undefined}
          className={cn(
            "text-sm font-semibold",
            active ? "text-stone-ink" : "text-stone-ink/70"
          )}
        >
          {title}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 lg:hidden">
      {simulator.steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-md text-xs font-bold",
                done && "bg-stone-green-500 text-stone-ink",
                active && "bg-stone-ink text-white",
                !done && !active && "bg-stone-ink/8 text-stone-ink/65"
              )}
            >
              {done ? (
                <Check aria-hidden className="size-3.5" strokeWidth={3} />
              ) : (
                index + 1
              )}
            </span>
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "text-sm font-semibold",
                active ? "text-stone-ink" : "text-stone-ink/65"
              )}
            >
              {step.name}
            </span>
            {index < simulator.steps.length - 1 && (
              <span aria-hidden className="mx-1 h-px w-6 bg-stone-ink/12" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function Auction() {
  return (
    <div
      className="grid flex-1 content-start gap-4 rounded-xl border border-dashed border-stone-ink/8 p-5"
      role="status"
    >
      <p className="flex items-center gap-2 font-semibold text-stone-ink">
        <LoaderCircle
          aria-hidden
          className="size-4 animate-spin text-stone-green-600 motion-reduce:animate-none"
        />
        Leilão em andamento
      </p>
      <ul className="grid gap-2.5">
        {simulator.bids.map((bid, index) => (
          <li
            key={bid}
            style={{ animationDelay: `${index * 0.45}s` }}
            className="flex animate-in items-center gap-2 text-sm text-stone-ink/65 duration-500 fill-mode-both fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
          >
            <span className="size-1.5 rounded-full bg-stone-green-500" />
            {bid}
          </li>
        ))}
      </ul>
    </div>
  )
}

function OptionCard({
  option,
  price,
  checked,
  cheapest,
  fastest,
  disabled,
  onSelect,
}: {
  option: QuoteOption
  price: number
  checked: boolean
  cheapest: boolean
  fastest: boolean
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <label
      className={cn(
        "relative grid gap-2 rounded-xl border p-3.5 transition-colors",
        disabled ? "cursor-default" : "cursor-pointer",
        "has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-stone-green-600/40",
        checked
          ? "border-stone-green-500 bg-stone-green-50"
          : "border-stone-ink/12 bg-white hover:border-stone-ink/25"
      )}
    >
      <input
        type="radio"
        name="frete"
        value={option.id}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="sr-only"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <IconTile
            variant="frame"
            size="sm"
            aria-hidden="true"
            className={checked ? "text-primary" : undefined}
          >
            {option.id === "turbo" ? <Zap /> : <Truck />}
          </IconTile>
          <div className="min-w-0">
            <p className="truncate text-sm leading-tight font-semibold text-stone-ink">
              {option.name}
            </p>
            <p className="truncate text-xs leading-tight text-stone-ink/65">
              {option.carrier}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {cheapest && (
            <span className="rounded-sm bg-stone-green-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-stone-green-800 uppercase">
              Mais barata
            </span>
          )}
          {fastest && (
            <span className="rounded-sm bg-stone-green-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-stone-green-800 uppercase">
              Mais rápida
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-stone-ink/65">
          <Clock aria-hidden className="size-3.5" />
          {option.eta}
        </span>
        <span className="font-stone-display text-2xl leading-none text-stone-ink">
          {brl.format(price)}
        </span>
      </div>
    </label>
  )
}

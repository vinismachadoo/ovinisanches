import { cn } from "@/lib/utils"
import { IconTile } from "@/components/reui/icon-tile"
import { Check } from "lucide-react"
import { differentials } from "../data/content"
import { DisplayHeading } from "./brand"
import { Reveal } from "./reveal"

const spans = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-6",
]

function ContractVisual() {
  const carriers = ["Rota Sul", "Expresso Norte", "Via Rápida", "+17 parceiros"]

  return (
    <div className="mt-7 rounded-xl border border-stone-ink/8 bg-stone-mist p-4">
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-black/5 pb-3">
        <span className="text-xs font-semibold text-stone-ink">
          Contrato Stone Entrega
        </span>
        <span className="rounded-sm bg-stone-green-500 px-2 py-0.5 text-[11px] font-bold text-stone-ink">
          Assinado
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {carriers.map((carrier) => (
          <li key={carrier} className="flex items-center justify-between gap-3">
            <span className="text-xs text-stone-ink/70">{carrier}</span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-stone-green-700">
              <Check aria-hidden className="size-3" strokeWidth={3} />
              homologada
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FeaturedVisual() {
  return (
    <div className="mt-7 rounded-xl border border-stone-ink/8 bg-white p-4">
      <div className="flex items-center gap-2.5 border-b border-dashed border-black/5 pb-3">
        <span className="grid size-7 place-items-center rounded-md bg-stone-green-500 text-xs font-bold text-stone-ink">
          S
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-stone-ink">
            Camila · Especialista Stone
          </p>
          <p className="text-[11px] text-stone-green-700">Online agora</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <p className="max-w-[85%] rounded-lg rounded-tl-sm bg-stone-ink/5 px-3 py-2 text-xs text-stone-ink/70">
          A transportadora sumiu com o meu pacote.
        </p>
        <p className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-stone-green-50 px-3 py-2 text-xs text-stone-green-900">
          Deixa comigo. Abri a ocorrência, acionei o seguro e já estou com o
          backup em rota.
        </p>
      </div>
    </div>
  )
}

export function Differentials() {
  return (
    <section
      id="diferenciais"
      className="relative scroll-mt-28 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[90rem] px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <DisplayHeading className="text-stone-ink">
              {differentials.title}
            </DisplayHeading>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-stone-ink/65 mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
              {differentials.description}
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {differentials.items.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal
                key={item.title}
                delay={index * 0.05}
                className={cn("h-full sm:col-span-1", spans[index])}
              >
                <li
                  className={cn(
                    "group h-full list-none rounded-xl border p-6 transition-colors duration-300 lg:p-7",
                    item.featured
                      ? "border-stone-green-200 bg-stone-green-50/70"
                      : "border-stone-ink/8 bg-white hover:border-stone-green-300"
                  )}
                >
                  <div
                    className={cn(
                      item.wide &&
                        "lg:flex lg:items-center lg:justify-between lg:gap-12"
                    )}
                  >
                    <div className={cn(item.wide && "lg:max-w-lg")}>
                      <IconTile variant="frame" size="lg" aria-hidden="true">
                        <Icon />
                      </IconTile>

                      <h3 className="mt-5 text-xl font-semibold tracking-tight text-stone-ink">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-base leading-relaxed text-pretty text-stone-ink/65">
                        {item.description}
                      </p>
                    </div>

                    {item.tags && (
                      <ul
                        className={cn(
                          "mt-5 flex flex-wrap gap-2",
                          item.wide && "lg:mt-0 lg:shrink-0 lg:justify-end"
                        )}
                      >
                        {item.tags.map((tag) => (
                          <li
                            key={tag}
                            className={cn(
                              "rounded-md border border-stone-ink/10 bg-white px-3 py-1 text-xs font-medium text-stone-ink/70",
                              item.wide && "lg:px-4 lg:py-2 lg:text-sm"
                            )}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {item.visual === "chat" && <FeaturedVisual />}
                  {item.visual === "contract" && <ContractVisual />}
                </li>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

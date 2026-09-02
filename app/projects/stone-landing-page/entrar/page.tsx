import { ArrowLeft, CircleDot, Clock, MapPin, ShieldCheck, Truck, Zap } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { DisplayHeading, Wordmark } from "../components/brand"
import { simulator } from "../data/content"
import { brl, estimateDistanceKm, priceFor } from "../data/quote"
import { SignupForm } from "./signup-form"

export const metadata: Metadata = {
  title: "Criar conta — Stone Entrega",
  description: "Abra sua conta Stone Entrega e confirme a coleta simulada.",
}

const reassurance = [
  "Sem mensalidade e sem volume mínimo",
  "Seguro total de carga em todo envio",
  "Atendimento humano em 5 segundos",
]

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ frete?: string; de?: string; para?: string }>
}) {
  const { frete, de, para } = await searchParams
  const option = simulator.options.find((item) => item.id === frete)
  const quote =
    option && de && para
      ? { option, origin: de, destination: para, distanceKm: estimateDistanceKm(de, para) }
      : null

  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.05fr]">
      <aside className="bg-stone-ink relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
        <div
          aria-hidden
          className="from-stone-green-600/30 pointer-events-none absolute -top-40 -left-32 size-[36rem] rounded-full bg-radial from-0% to-transparent to-70% blur-2xl"
        />

        <Link href="/projects/stone-landing-page" className="relative w-fit rounded-md">
          <Wordmark />
          <span className="sr-only">Voltar para a página inicial da Stone Entrega</span>
        </Link>

        <div className="relative max-w-md">
          <DisplayHeading className="text-left text-[clamp(2.5rem,4vw,3.75rem)] text-white">
            Sua última <span className="text-stone-green-400">etapa</span> antes da coleta
          </DisplayHeading>

          {quote ? (
            <div className="mt-8 rounded-xl border border-white/15 bg-white/8 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                Sua simulação
              </p>

              <div className="mt-4 grid gap-2 text-sm">
                <p className="flex items-start gap-2 text-white/85">
                  <MapPin aria-hidden className="text-stone-green-400 mt-0.5 size-4 shrink-0" />
                  {quote.origin}
                </p>
                <p className="flex items-start gap-2 text-white/85">
                  <CircleDot aria-hidden className="text-stone-green-400 mt-0.5 size-4 shrink-0" />
                  {quote.destination}
                </p>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
                <div className="flex items-center gap-2.5">
                  <span className="bg-stone-green-500 text-stone-ink grid size-9 shrink-0 place-items-center rounded-lg">
                    {quote.option.id === "turbo" ? (
                      <Zap aria-hidden className="size-4.5" />
                    ) : (
                      <Truck aria-hidden className="size-4.5" />
                    )}
                  </span>
                  <div>
                    <p className="leading-tight font-semibold text-white">{quote.option.name}</p>
                    <p className="flex items-center gap-1 text-xs leading-tight text-white/65">
                      <Clock aria-hidden className="size-3" />
                      {quote.option.eta}
                    </p>
                  </div>
                </div>
                <p className="font-stone-display text-3xl leading-none text-white">
                  {brl.format(priceFor(quote.option, quote.distanceKm))}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-lg leading-relaxed text-pretty text-white/70">
              Crie sua conta para simular fretes ilimitados, comparar transportadoras e agendar a
              primeira coleta ainda hoje.
            </p>
          )}
        </div>

        <ul className="relative grid gap-2.5">
          {reassurance.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-white/70">
              <ShieldCheck aria-hidden className="text-stone-green-400 size-4 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-lg">
          <Link
            href="/projects/stone-landing-page"
            className="text-stone-ink/65 hover:text-stone-ink focus-visible:ring-stone-green-600/40 inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none lg:hidden"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Voltar
          </Link>

          <div className="mt-6 lg:mt-0">
            <h1 className="text-stone-ink text-3xl font-semibold tracking-tight">
              Criar conta Stone Entrega
            </h1>
            <p className="text-stone-ink/65 mt-2 text-pretty">
              {quote
                ? "Confirme seus dados para liberar a coleta simulada e enviar seu primeiro pacote."
                : "Abra sua conta em minutos e comece a enviar hoje mesmo."}
            </p>
          </div>

          <div className="mt-8">
            <SignupForm />
          </div>
        </div>
      </main>
    </div>
  )
}

import type { QuoteOption } from "./content"

export const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

/** Stable pseudo-distance so the same pair of addresses always quotes the same price. */
export function estimateDistanceKm(origin: string, destination: string) {
  const seed = `${origin}|${destination}`.toLowerCase()
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 100_000
  return 4 + (hash % 137)
}

/** Sub-linear on distance, so long hauls stay in a believable range instead of exploding. */
export function priceFor(option: QuoteOption, distanceKm: number, sizeMultiplier = 1) {
  return (option.basePrice + option.perKm * distanceKm ** 0.75) * sizeMultiplier
}

import { hero } from "../data/content"
import { Reveal } from "./reveal"

export function Stats() {
  return (
    <section
      id="stats"
      className="border-stone-ink/8 relative border-y bg-white"
    >
      <dl className="mx-auto grid max-w-[90rem] grid-cols-2 gap-y-8 px-6 py-10 sm:grid-cols-4 sm:gap-y-0">
        {hero.stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.05}>
            <div className="text-center sm:text-left">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-stone-display text-stone-ink block text-4xl leading-none">
                  {stat.value}
                </span>
                <span className="text-stone-ink/65 mt-1.5 block text-sm">{stat.label}</span>
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

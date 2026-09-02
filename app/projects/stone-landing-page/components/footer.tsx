import { Instagram, Linkedin, Youtube } from "lucide-react"
import { footer } from "../data/content"
import { Wordmark } from "./brand"

const socials = [
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
  { label: "YouTube", icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-stone-ink relative overflow-hidden pt-20">
      <div className="relative mx-auto max-w-[90rem] px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-xs text-base leading-relaxed text-white/50 text-pretty">
              {footer.description}
            </p>
            <ul className="mt-7 flex gap-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href="#redes"
                    aria-label={social.label}
                    className="focus-visible:ring-offset-stone-ink grid size-10 touch-manipulation place-items-center rounded-md text-white/60 ring-1 ring-white/12 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <social.icon aria-hidden className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Rodapé" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="focus-visible:ring-offset-stone-ink rounded text-sm text-white/65 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-white/50">{footer.legal}</p>
          <p className="text-xs whitespace-nowrap text-white/50">
            © {new Date().getFullYear()} Stone Entrega
          </p>
        </div>
      </div>

      <div aria-hidden className="relative select-none">
        <p className="font-stone-display translate-y-[22%] text-center text-[clamp(5rem,20vw,16rem)] leading-none text-white/[0.045] uppercase">
          Stone Entrega
        </p>
      </div>
    </footer>
  )
}

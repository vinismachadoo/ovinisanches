import { Separator } from "@/registry/default/ui/separator"
import { Brands } from "./components/brands"
import { Differentials } from "./components/differentials"
import { Footer } from "./components/footer"
import { Hero } from "./components/hero"
import { Integrations } from "./components/integrations"
import { Join } from "./components/join"
import { Journey } from "./components/journey"
import { Segments } from "./components/segments"
import { Simulator } from "./components/simulator"
import { SiteNav } from "./components/site-nav"
import { Stats } from "./components/stats"
import { Support } from "./components/support"

export default function StoneLandingPage() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-stone-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <SiteNav />

      {/* Pulled under the sticky nav so the hero photo sits behind the frosted pill. */}
      <main id="conteudo" className="-mt-19 sm:-mt-20">
        <Hero />
        <Brands />
        <Differentials />

        <Separator className="bg-stone-ink/5" />

        <Stats />

        <Separator className="bg-stone-ink/5" />

        <Simulator />

        <Separator className="bg-stone-ink/5" />

        <Segments />
        {/* <Journey /> */}
        <Integrations />
        {/* <Support /> */}
        <Join />
      </main>

      <Footer />
    </>
  )
}

import { Brands } from "./components/brands"
import { Differentials } from "./components/differentials"
import { Footer } from "./components/footer"
import { Hero } from "./components/hero"
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
        className="focus:bg-stone-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <SiteNav />

      {/* Pulled under the sticky nav so the hero photo sits behind the frosted pill. */}
      <main id="conteudo" className="-mt-19 sm:-mt-20">
        <Hero />
        <Stats />
        <Differentials />
        <Brands />
        <Journey />
        <Simulator />
        <Support />
        <Segments />
        <Join />
      </main>

      <Footer />
    </>
  )
}

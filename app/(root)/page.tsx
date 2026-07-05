import Activities from "@/app/(root)/components/activities"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowUpRightIcon,
  BeerIcon,
  CoffeeIcon,
  FlaskConicalIcon,
  GripIcon,
  LineSquiggleIcon,
  ProjectorIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function Home() {
  const t = useTranslations("home-page.main")

  return (
    <div className="flex h-full w-full flex-col items-center [--sidebar-profile:--spacing(140)]">
      <div
        className={cn(
          "mx-auto flex max-w-5xl flex-col py-4 min-[1024px]:border-x",
          "min-h-min w-full flex-1 items-start gap-x-6 px-0"
        )}
      >
        <div className="flex size-full flex-col justify-start gap-y-4 px-4">
          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-px p-2">
              <h2 className="text-base font-medium">{t("clients.title")}</h2>
              <p className="max-w-xl text-sm text-balance text-muted-foreground">
                {t("clients.subtitle")}
              </p>
            </div>
            <section className="grid min-h-0 grid-cols-1 gap-1.5 rounded-sm border bg-muted p-1">
              <a target="_blank" href="https://cafecomoscapuchinhos.com.br">
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex aspect-square size-8 flex-col items-center justify-center rounded-md bg-taupe-700 shadow-sm">
                    <CoffeeIcon className="size-4 stroke-white stroke-2" />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-medium">
                      Café com os Capuchinhos
                    </p>
                    <ArrowUpRightIcon className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    Conheça a história dos franciscanos enquanto desfruta de um
                    delicioso café da manhã.
                  </p>
                </div>
              </a>
            </section>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-px p-2">
              <h2 className="text-base font-medium">
                {t("experiences.title")}
              </h2>
              <p className="max-w-xl text-sm text-balance text-muted-foreground">
                {t("experiences.subtitle")}
              </p>
            </div>
            <section className="grid min-h-0 grid-cols-1 gap-1.5 rounded-sm border bg-muted p-1">
              <a target="_blank" href="https://www.stone.com.br/">
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex size-8 items-center justify-center overflow-hidden rounded-md">
                    <img
                      src="https://www.imaquininhas.com.br/wp-content/uploads/2023/02/logo-da-stone.jpg"
                      alt="Stone"
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <p className="text-base font-medium">Stone</p>
                      <p className="text-sm text-muted-foreground">
                        (2026 - Presente)
                      </p>
                    </div>
                    <ArrowUpRightIcon className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    Gerente de Produto III - Logística
                  </p>
                </div>
              </a>
              <a target="_blank" href="https://abbiamolog.com">
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex size-8 items-center justify-center overflow-hidden rounded-md">
                    <img
                      src="https://abbiamolog.com/logos/Abbiamo_icon.png"
                      alt="Abbiamo"
                      className="scale-190 object-cover"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <p className="text-base font-medium">Abbiamo</p>
                      <p className="text-sm text-muted-foreground">
                        (2022 - 2026)
                      </p>
                    </div>
                    <ArrowUpRightIcon className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    Líder de Produto
                  </p>
                </div>
              </a>
            </section>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-px p-2">
              <h2 className="text-base font-medium">{t("web-apps.title")}</h2>
              <p className="max-w-xl text-sm text-balance text-muted-foreground">
                {t("web-apps.subtitle")}
              </p>
            </div>
            <section className="grid min-h-0 grid-cols-1 gap-1.5 rounded-sm border bg-muted p-1">
              <a target="_blank" href="https://botecada.vercel.app">
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex aspect-square size-8 flex-col items-center justify-center rounded-md bg-yellow-300 shadow-sm">
                    <BeerIcon className="size-4 stroke-black stroke-2" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-medium">Botecada</p>
                    <ArrowUpRightIcon className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    O GymRats do Comida di Buteco 2026. Crie grupos para
                    competir com seus amigos. Favorite, salve e avalie.
                    Divirta-se!
                  </p>
                </div>
              </a>
            </section>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-px p-2">
              <h2 className="text-base font-medium">{t("projects.title")}</h2>
              <p className="max-w-xl text-sm text-balance text-muted-foreground">
                {t("projects.subtitle")}
              </p>
            </div>
            <section className="grid min-h-0 grid-cols-1 gap-1.5 rounded-sm border bg-muted p-1 sm:grid-cols-2">
              <a
                target="_blank"
                href="https://labs.ovinisanches.com"
                className="col-span-2"
              >
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex aspect-square size-8 flex-col items-center justify-center rounded-md bg-purple-300 shadow-sm">
                    <FlaskConicalIcon className="size-4 stroke-black stroke-2" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-medium">Labs</p>
                    <ArrowRight className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    My personal projects and experiments.
                  </p>
                </div>
              </a>

              <a target="_blank" href="https://motionvg.ovinisanches.com">
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex aspect-square size-8 flex-col items-center justify-center rounded-md bg-slate-300 shadow-sm">
                    <LineSquiggleIcon className="size-4 stroke-black stroke-2" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-medium">Motionvg</p>
                    <ArrowRight className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    A motion design library.
                  </p>
                </div>
              </a>

              <a target="_blank" href="https://presentcn.ovinisanches.com">
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex aspect-square size-8 flex-col items-center justify-center rounded-md bg-sky-300 shadow-sm">
                    <ProjectorIcon className="size-4 stroke-black stroke-2" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-medium">presentcn</p>
                    <ArrowRight className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    A presentation template.
                  </p>
                </div>
              </a>

              <a
                target="_blank"
                href="https://heatmap-tracker.ovinisanches.com"
              >
                <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
                  <div className="flex aspect-square size-8 flex-col items-center justify-center rounded-md bg-emerald-300 shadow-sm">
                    <GripIcon className="size-4 stroke-black stroke-2" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-medium">Heatmap Tracker</p>
                    <ArrowRight className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-pretty text-muted-foreground">
                    A heatmap tracker.
                  </p>
                </div>
              </a>
            </section>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-px p-2">
              <h2 className="text-base font-medium">{t("activity.title")}</h2>
              <p className="max-w-xl text-sm text-balance text-muted-foreground">
                {t("activity.subtitle")}{" "}
                <Link
                  href="https://heatmap-tracker.ovinisanches.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Heatmap Tracker
                </Link>
              </p>
            </div>
            <section className="grid min-h-0 grid-cols-1 gap-1.5 rounded-sm border bg-muted p-1.5">
              <div className="flex w-full flex-col items-center justify-center gap-y-2 rounded-sm bg-background shadow-sm">
                <Activities />
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  )
}

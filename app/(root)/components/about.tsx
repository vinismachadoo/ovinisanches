import ActivitiesSection from "@/app/(root)/components/activities"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  ArrowRight,
  BeerIcon,
  CheckIcon,
  FlaskConicalIcon,
  GripIcon,
  LineSquiggleIcon,
  ProjectorIcon,
} from "lucide-react"

export default function About() {
  const t = useTranslations("home-page.about")

  return (
    <div className="flex size-full flex-col justify-start gap-y-4 px-4">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-px p-2">
          <h2 className="text-base font-medium">{t("activity.title")}</h2>
          <p className="max-w-xl text-sm text-balance text-muted-foreground">
            Built with{" "}
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
            <ActivitiesSection />
          </div>
        </section>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-px p-2">
          <h2 className="text-base font-medium">{t("projects.title")}</h2>
          <p className="max-w-xl text-sm text-balance text-muted-foreground">
            My personal projects and experiments.
          </p>
        </div>
        <section className="grid min-h-0 grid-cols-1 gap-1.5 rounded-sm border bg-muted p-1.5 sm:grid-cols-2">
          <a
            target="_blank"
            href="https://labs.ovinisanches.com"
            className="col-span-2"
          >
            <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
              <div className="flex size-10 flex-col items-center justify-center rounded-md bg-purple-300 p-2 shadow-sm">
                <FlaskConicalIcon className="size-full stroke-black stroke-2" />
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
              <div className="flex size-10 flex-col items-center justify-center rounded-md bg-slate-300 p-2 shadow-sm">
                <LineSquiggleIcon className="size-full stroke-black stroke-2" />
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
              <div className="flex size-10 flex-col items-center justify-center rounded-md bg-sky-300 p-2 shadow-sm">
                <ProjectorIcon className="size-full stroke-black stroke-2" />
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

          <a target="_blank" href="https://heatmap-tracker.ovinisanches.com">
            <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
              <div className="flex size-10 flex-col items-center justify-center rounded-md bg-emerald-300 p-2 shadow-sm">
                <GripIcon className="size-full stroke-black stroke-2" />
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
          <h2 className="text-base font-medium">{t("web-apps.title")}</h2>
          <p className="max-w-xl text-sm text-balance text-muted-foreground">
            Apps I've built for fun and learning.
          </p>
        </div>
        <section className="grid min-h-0 grid-cols-1 gap-1.5 rounded-sm border bg-muted p-1.5 sm:grid-cols-2 lg:grid-cols-3">
          <a target="_blank" href="https://botecada.vercel.app">
            <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
              <div className="flex size-10 flex-col items-center justify-center rounded-md bg-yellow-300 p-2 shadow-sm">
                <BeerIcon className="size-full stroke-black stroke-2" />
              </div>
              <p className="mt-3 text-base font-medium">Botecada</p>
              <p className="text-sm font-medium text-pretty text-muted-foreground">
                A beer tracker app.
              </p>
            </div>
          </a>

          <a target="_blank" href="https://checked-nu.vercel.app/">
            <div className="flex h-full min-w-0 cursor-pointer flex-col gap-1 rounded-sm border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
              <div className="flex size-10 flex-col items-center justify-center rounded-md bg-blue-600 p-2 shadow-sm">
                <CheckIcon className="size-full stroke-white stroke-2" />
              </div>
              <p className="mt-3 text-base font-medium">Checked</p>
              <p className="text-sm font-medium text-pretty text-muted-foreground">
                A task list app.
              </p>
            </div>
          </a>
        </section>
      </section>
    </div>
  )
}

import ActivitiesSection from "@/app/(root)/components/activities-section"
import Presentation from "@/app/(root)/components/presentation"
import ProjectsSection from "@/app/(root)/components/projects-section"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion"

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 [--sidebar-profile:calc(var(--spacing)*140)]">
      {/* <Image src="/rio-isometric.png" alt="Logo" width={500} height={500} /> */}

      <div
        className={cn(
          "grid grid-cols-[var(--sidebar-profile)_minmax(0,1fr)]",
          "min-h-min w-full flex-1 items-start gap-x-6 px-0"
        )}
      >
        <Presentation />

        <div className="flex size-full flex-col rounded-lg border border-dashed px-4">
          <Accordion multiple defaultValue={["activity", "projects"]}>
            <AccordionItem value="activity">
              <AccordionTrigger className="text-base hover:no-underline">
                Activity
              </AccordionTrigger>
              {/* use keepMounted to avoid unmounting the component when the accordion is closed (heavy component causes lag) */}
              <AccordionContent keepMounted>
                <ActivitiesSection />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="projects">
              <AccordionTrigger className="text-base hover:no-underline">
                Projects
              </AccordionTrigger>
              <AccordionContent>
                <ProjectsSection />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

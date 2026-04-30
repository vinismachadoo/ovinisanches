import ActivitiesSection from "@/app/(root)/components/activities-section"
import WebAppsSection from "@/app/(root)/components/web-apps-section"
import ProjectsSection from "@/app/(root)/components/projects-section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion"
import { useTranslations } from "next-intl"

export default function About() {
  const t = useTranslations("home-page.about")

  return (
    <div className="flex size-full flex-col rounded-lg border border-dashed px-4">
      <Accordion multiple defaultValue={["activity", "projects", "web-apps"]}>
        <AccordionItem value="activity">
          <AccordionTrigger className="text-base hover:no-underline">
            {t("activity.title")}
          </AccordionTrigger>
          {/* use keepMounted to avoid unmounting the component when the accordion is closed (heavy component causes lag) */}
          <AccordionContent keepMounted>
            <ActivitiesSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="projects">
          <AccordionTrigger className="text-base hover:no-underline">
            {t("projects.title")}
          </AccordionTrigger>
          <AccordionContent>
            <ProjectsSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="web-apps">
          <AccordionTrigger className="text-base hover:no-underline">
            {t("web-apps.title")}
          </AccordionTrigger>
          <AccordionContent>
            <WebAppsSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

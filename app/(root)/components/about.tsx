import ActivitiesSection from "@/app/(root)/components/activities-section"
import ProductsSection from "@/app/(root)/components/products-section"
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
      <Accordion multiple defaultValue={["activity", "projects", "products"]}>
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
        <AccordionItem value="products">
          <AccordionTrigger className="text-base hover:no-underline">
            {t("products.title")}
          </AccordionTrigger>
          <AccordionContent>
            <ProductsSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

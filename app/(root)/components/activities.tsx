"use client"

import { HeatmapTracker } from "@/registry/default/ui/heatmap-tracker"
import { useQuery } from "@tanstack/react-query"
import { enUS, ptBR } from "date-fns/locale"
import { useLocale } from "next-intl"

const GITHUB_USERNAME = "vinismachadoo"

const Activities = () => {
  const locale = useLocale()

  const { data: githubActivities, isLoading } = useQuery({
    queryKey: ["github", "activities", GITHUB_USERNAME],
    queryFn: () =>
      fetch(
        `/api/github-activity?username=${GITHUB_USERNAME}&years=2026,2025`
      ).then((res) => res.json()),
    select: (data) =>
      data.contributions.map(
        (date: { date: string; count: number; level: number }) => ({
          date: new Date(date.date),
          count: date.count,
          level: date.count > 0 ? date.level : null,
        })
      ),
  })

  return (
    <HeatmapTracker
      data={githubActivities || []}
      isLoading={isLoading}
      locale={locale === "en" ? enUS : ptBR}
      shapes={["x", "x", "x", "x", "x"]}
      className="w-full"
      classNames={{
        months: "flex-row",
      }}
      style={
        {
          "--day-size": "calc(var(--spacing)*3)",
        } as React.CSSProperties
      }
      legendAlign="center"
    />
  )
}

export default Activities

"use client"

import {
  CalendarHeatmap,
  CalendarHeatmapContainer,
  CalendarHeatmapLegend,
} from "@/components/calendar-heatmap"
import { Skeleton } from "@/registry/default/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { enUS, ptBR } from "date-fns/locale"
import { useLocale } from "next-intl"

const GITHUB_USERNAME = "vinismachadoo"

const Activities = () => {
  const locale = useLocale()

  const { data: githubActivities, isLoading } = useQuery({
    queryKey: ["github", "activities", GITHUB_USERNAME],
    queryFn: () =>
      fetch(`/api/github-activity?username=${GITHUB_USERNAME}`).then((res) =>
        res.json()
      ),
    select: (data) =>
      data.contributions.map(
        (date: { date: string; count: number; intensity: number }) => ({
          date: new Date(date.date),
          count: date.count,
          intensity: date.intensity,
        })
      ),
  })

  return (
    <div className="flex w-full justify-center">
      {isLoading ? (
        <div className="flex w-full flex-col gap-y-4 p-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-6 w-32 self-end" />
        </div>
      ) : (
        <CalendarHeatmapContainer>
          <CalendarHeatmap
            data={githubActivities}
            locale={locale === "en" ? enUS : ptBR}
          />
          <CalendarHeatmapLegend />
        </CalendarHeatmapContainer>
      )}
    </div>
  )
}

export default Activities

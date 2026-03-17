"use client"

import {
  CalendarHeatmap,
  CalendarHeatmapContainer,
  CalendarHeatmapLegend,
} from "@/components/calendar-heatmap"
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
        <div>Loading...</div>
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

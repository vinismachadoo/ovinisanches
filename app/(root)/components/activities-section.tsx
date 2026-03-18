"use client"

import {
  HeatmapTracker,
  HeatmapTrackerContainer,
  HeatmapTrackerLegend,
} from "@/components/ui/heatmap-tracker"
import { Skeleton } from "@/registry/default/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { enUS, ptBR } from "date-fns/locale"
import { useLocale } from "next-intl"
import Link from "next/link"

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
        (date: { date: string; count: number; level: number }) => ({
          date: new Date(date.date),
          count: date.count,
          level: date.level,
        })
      ),
  })

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-2">
      {isLoading ? (
        <div className="flex w-full flex-col gap-y-4 p-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-6 w-32 self-end" />
        </div>
      ) : (
        <HeatmapTrackerContainer className="[--level-0:var(--muted)] dark:[--level-0:var(--muted)]">
          <HeatmapTracker
            data={githubActivities}
            locale={locale === "en" ? enUS : ptBR}
          />
          <HeatmapTrackerLegend />
        </HeatmapTrackerContainer>
      )}

      <span className="text-muted-foreground">
        Built with{" "}
        <Link
          href="https://heatmap-tracker.ovinisanches.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Heatmap Tracker
        </Link>
      </span>
    </div>
  )
}

export default Activities

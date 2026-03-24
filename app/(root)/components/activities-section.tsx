"use client"

import { HeatmapTracker } from "@/registry/default/ui/heatmap-tracker"
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
    <div className="flex w-full flex-col items-center justify-center gap-y-2">
      <HeatmapTracker
        data={githubActivities || []}
        isLoading={isLoading}
        locale={locale === "en" ? enUS : ptBR}
        shapes={["x", "x", "x", "x", "x"]}
      />

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

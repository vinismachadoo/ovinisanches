// Original code: https://github.com/sallar/github-contributions-chart

import * as cheerio from "cheerio"
import _ from "lodash"

const COLOR_MAP: Record<string, string> = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
}

async function fetchYears(username: string) {
  const data = await fetch(`https://github.com/${username}?tab=contributions`, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
  })
  const body = await data.text()
  const $ = cheerio.load(body)
  return $(".js-year-link.filter-item")
    .get()
    .map((a) => {
      const $a = $(a)
      const href = $a.attr("href")
      const githubUrl = new URL(`https://github.com${href}`)
      githubUrl.searchParams.set("tab", "contributions")
      const formattedHref = `${githubUrl.pathname}${githubUrl.search}`

      return {
        href: formattedHref,
        text: $a.text().trim(),
      }
    })
}

async function fetchDataForYear(url: string, year: string, format: string) {
  const data = await fetch(`https://github.com${url}`, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
  })
  const $ = cheerio.load(await data.text())
  const $days = $("table.ContributionCalendar-grid td.ContributionCalendar-day")

  const contribText = $(".js-yearly-contributions h2")
    .text()
    .trim()
    .match(/^([0-9,]+)\s/)
  let contribCount = 0
  if (contribText?.[1]) {
    contribCount = parseInt(contribText[1].replace(/,/g, ""), 10)
  }

  return {
    year,
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr("data-date"),
      end: $($days.get($days.length - 1)).attr("data-date"),
    },
    contributions: (() => {
      const parseDay = (day: any, index: number) => {
        const $day = $(day)
        const id = $day.attr("id")
        const $tooltip = $('tool-tip[for="' + id + '"]')
        const date = $day
          ?.attr("data-date")
          ?.split("-")
          .map((d) => parseInt(d, 10))
        const color = COLOR_MAP[$day?.attr("data-level") ?? "0"]
        const value = {
          date: $day.attr("data-date"),
          count: parseInt($tooltip.text().split(" ")[0], 10) ?? 0,
          color,
          intensity: parseInt($day.attr("data-level") ?? "0", 10),
        }
        return { date, value }
      }

      if (format !== "nested") {
        return $days.get().map((day, index) => parseDay(day, index).value)
      }

      return $days.get().reduce(
        (o, day, index) => {
          const { date, value } = parseDay(day, index)
          if (!date || date.length < 3) return o
          const [y, m, d] = date
          if (!o[y]) o[y] = {}
          if (!o[y][m]) o[y][m] = {}
          o[y][m][d] = value
          return o
        },
        {} as Record<number, Record<number, Record<number, unknown>>>
      )
    })(),
  }
}

interface GithubActivityContributions extends Record<
  string,
  Record<
    string,
    Record<
      string,
      {
        date: string
        count: number
        color: string
        intensity: string
      }
    >
  >
> {}

interface GithubActivityForAllYears {
  years: Record<
    string,
    {
      total: number
      range: {
        start: string
        end: string
      }
      year: number
    }
  >
  contributions: GithubActivityContributions
}

export async function fetchDataForAllYears(
  username: string,
  format: "nested" | "flat"
) {
  const years = await fetchYears(username)
  return Promise.all(
    years.map((year) => fetchDataForYear(year.href, year.text, format))
  ).then((resp) => {
    return {
      years: (() => {
        const obj = {}
        const arr = resp.map((year) => {
          const { contributions, ...rest } = year
          _.setWith(obj, [rest.year], rest, Object)
          return rest
        })
        return format === "nested" ? obj : arr
      })(),
      contributions:
        format === "nested"
          ? resp.reduce(
              (acc, curr) => _.merge(acc, curr.contributions),
              {} as Record<string, unknown>
            )
          : resp
              .reduce<
                Array<{
                  date: string | undefined
                  count: number
                  color: string
                  intensity: string | number
                }>
              >(
                (list, curr) => [
                  ...list,
                  ...(Array.isArray(curr.contributions)
                    ? curr.contributions
                    : []),
                ],
                []
              )
              .sort((a, b) => {
                const da = a.date ?? ""
                const db = b.date ?? ""
                if (da < db) return 1
                if (da > db) return -1
                return 0
              }),
    }
  })
}

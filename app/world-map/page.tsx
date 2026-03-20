import WorldMap from "@/app/world-map/world-map"
import { useLocale, useTranslations } from "next-intl"

const MundiPage = () => {
  const t = useTranslations("travel-page")
  const locale = useLocale()
  const countries = [
    "BRA",
    "USA",
    "URY",
    "PRY",
    "MEX",
    "FRA",
    "NLD",
    "BEL",
    "DNK",
    "SWE",
    "FIN",
    "EST",
    "CZE",
    "AUT",
    "HUN",
    "DEU",
    "ZAF",
    "CHE",
    "ESP",
    "HRV",
    "BIH",
    "ALB",
    "ITA",
    "VAT",
  ]
  return (
    <div className="flex h-full w-full flex-col items-center gap-y-4 p-10 font-mono">
      <h1 className="mb-4 text-lg font-semibold">{t("title")}</h1>

      <WorldMap visited={countries} className="h-full w-full" />

      <div id="legend" className="flex gap-x-4">
        <div className="flex items-center gap-x-2">
          <span className="size-3 bg-lime-300 dark:bg-lime-800"></span>
          <span>{t("legend.visited")}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="size-3 bg-sky-300 dark:bg-sky-800"></span>
          <span>{t("legend.lived")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <span className="font-semibold">{t("status")}:</span>{" "}
          <span>
            {countries.length} of 195 -{" "}
            {((countries.length / 195) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="font-semibold">{t("last-update")}: </span>
          <span>
            {Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(
              new Date("2026-03-19")
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MundiPage

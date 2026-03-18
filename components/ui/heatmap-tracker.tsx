"use client"

import { cn } from "@/lib/utils"
import { Calendar } from "@/registry/default/ui/calendar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip"
import * as React from "react"
import {
  Day,
  useDayPicker,
  WeekNumber,
  type WeekProps,
  type DayProps,
  type PropsBase,
} from "react-day-picker"
import { enUS, Locale } from "date-fns/locale"

const DAY_SIZE = "calc(var(--spacing)*4.5)"
const DAY_MARGIN = "2px"

type HeatmapTrackerContextValue = PropsBase & {
  normalizeDate: (d: Date) => number
}

const HeatmapTrackerContext = React.createContext<
  HeatmapTrackerContextValue | undefined
>(undefined)

export const useHeatmapTracker = () => {
  const context = React.useContext(HeatmapTrackerContext)
  if (!context) {
    throw new Error(
      "useHeatmapTracker must be used within a HeatmapTrackerContainer"
    )
  }
  return context
}

const HeatmapTrackerContainer = ({
  children,
  className,
  style,
  lightColors = [],
  darkColors = [],
  ...props
}: React.ComponentProps<typeof Calendar> & {
  children: React.ReactNode
  lightColors?: string[]
  darkColors?: string[]
}) => {
  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

  return (
    <HeatmapTrackerContext.Provider
      value={{
        normalizeDate: normalize,
        ...props,
      }}
    >
      <div
        style={
          {
            "--level-0-light": lightColors[0] ?? "var(--color-lime-200)",
            "--level-1-light": lightColors[1] ?? "var(--color-lime-400)",
            "--level-2-light": lightColors[2] ?? "var(--color-lime-600)",
            "--level-3-light": lightColors[3] ?? "var(--color-lime-800)",
            "--level-4-light": lightColors[4] ?? "var(--color-lime-900)",
            "--level-0-dark": darkColors[0] ?? "var(--color-lime-900)",
            "--level-1-dark": darkColors[1] ?? "var(--color-lime-800)",
            "--level-2-dark": darkColors[2] ?? "var(--color-lime-600)",
            "--level-3-dark": darkColors[3] ?? "var(--color-lime-400)",
            "--level-4-dark": darkColors[4] ?? "var(--color-lime-200)",
            "--day-size": DAY_SIZE,
            "--day-margin": DAY_MARGIN,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "flex w-fit flex-col gap-y-4 overflow-x-scroll p-2",
          "[--level-0:var(--level-0-light)] [--level-1:var(--level-1-light)] [--level-2:var(--level-2-light)] [--level-3:var(--level-3-light)] [--level-4:var(--level-4-light)]",
          "dark:[--level-0:var(--level-0-dark)] dark:[--level-1:var(--level-1-dark)] dark:[--level-2:var(--level-2-dark)] dark:[--level-3:var(--level-3-dark)] dark:[--level-4:var(--level-4-dark)]",
          className
        )}
        // {...props}
      >
        {children}
      </div>
    </HeatmapTrackerContext.Provider>
  )
}

interface HeatmapTrackerData {
  date: Date
  count: number
  level: number
}

const HeatmapTracker = ({
  data,
  locale = enUS,
}: {
  data: Array<HeatmapTrackerData>
  locale?: Locale
}) => {
  const formatCaption = (date: Date) =>
    date.toLocaleString(locale?.code, { month: "short" })

  const { normalizeDate, classNames, components } = useHeatmapTracker()

  const levelModifiers = React.useMemo(
    () =>
      data.reduce(
        (acc, item) => {
          if (item.level === 0) {
            acc.zero.push(item.date)
          } else if (item.level === 1) {
            acc.one.push(item.date)
          } else if (item.level === 2) {
            acc.two.push(item.date)
          } else if (item.level === 3) {
            acc.three.push(item.date)
          } else if (item.level === 4) {
            acc.four.push(item.date)
          }
          return acc
        },
        {
          zero: [] as Date[],
          one: [] as Date[],
          two: [] as Date[],
          three: [] as Date[],
          four: [] as Date[],
        }
      ),
    [data]
  )

  const dataMap = React.useMemo(() => {
    const map = new Map<number, HeatmapTrackerData>()
    for (const item of data) {
      map.set(normalizeDate(item.date), item)
    }
    return map
  }, [data, normalizeDate])

  const oneYearAgoStartOfWeek = React.useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1)
    d.setDate(d.getDate() - d.getDay())
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const twelveMonthAgo = new Date(
    new Date().setMonth(new Date().getMonth() - 12)
  )

  return (
    <Calendar
      formatters={{ formatCaption }}
      locale={locale}
      numberOfMonths={13}
      defaultMonth={twelveMonthAgo}
      hideWeekdays
      fixedWeeks
      className="w-fit items-center justify-center p-0"
      classNames={{
        ...classNames,
        root: cn("w-auto", classNames?.root),
        nav: cn("hidden", classNames?.nav),
        caption_label: cn("text-xs font-normal", classNames?.caption_label),
        month: cn("ml-0 w-fit", classNames?.month),
        month_caption: cn("h-fit px-0", classNames?.month_caption),
        months: cn("w-fit gap-0", classNames?.months),
        month_grid: cn("w-fit", classNames?.month_grid),
        weeks: cn("flex w-fit", classNames?.weeks),
        week: cn(
          "mt-0 flex flex-col select-none data-[duplicated-previous-month=true]:hidden",
          classNames?.week
        ),
        day: cn(
          "m-(--day-margin) size-(--day-size) rounded-sm border border-border/20 bg-muted/50 text-xs text-transparent",
          "data-[hidden=true]:hidden",
          classNames?.day
        ),
        outside: cn("text-xs text-transparent", classNames?.outside),
        today: cn(
          "m-(--day-margin) size-(--day-size) rounded-sm border border-border/20 bg-muted/50 text-xs text-transparent",
          classNames?.day,
          classNames?.today
        ),
      }}
      modifiers={levelModifiers}
      modifiersClassNames={{
        zero: "bg-(--level-0)",
        one: "bg-(--level-1)",
        two: "bg-(--level-2)",
        three: "bg-(--level-3)",
        four: "bg-(--level-4)",
      }}
      components={{
        Week: ({ ...props }) => <CustomWeek {...props} />,
        Day: ({ ...props }) => (
          <CustomDay
            data={dataMap}
            firstDay={oneYearAgoStartOfWeek}
            {...props}
          />
        ),
        ...components,
      }}
    />
  )
}

function CustomWeek({ week, children, ...props }: WeekProps) {
  const { components, classNames, styles, dayPickerProps } = useDayPicker()

  const WeekNumberComponent = components?.WeekNumber ?? WeekNumber
  const showWeekNumber = dayPickerProps.showWeekNumber ?? false

  const displayMonth = week.days[0]?.displayMonth
  const monthOfLastDay = week.days[6]?.date.getMonth()
  const monthOfFirstDay = week.days[0]?.date.getMonth()
  const thisMonth = displayMonth?.getMonth()

  return (
    <tr
      data-duplicated-next-month={thisMonth !== monthOfLastDay}
      data-duplicated-previous-month={thisMonth !== monthOfFirstDay}
      className={classNames?.week}
      style={styles?.week}
      {...props}
    >
      {showWeekNumber && (
        <WeekNumberComponent
          week={week}
          className={classNames?.week_number}
          style={styles?.week_number}
        />
      )}
      {children}
    </tr>
  )
}

function CustomDay({
  day,
  modifiers,
  data,
  firstDay,
  ...props
}: DayProps & { data: Map<number, HeatmapTrackerData>; firstDay: Date }) {
  const { classNames, styles, formatters, dayPickerProps } = useDayPicker()
  const { normalizeDate } = useHeatmapTracker()

  const modifierClassNames = dayPickerProps.modifiersClassNames ?? {}
  const allClassNames: Record<string, string> = {
    ...classNames,
    ...modifierClassNames,
  }

  const modifierClasses = Object.entries(modifiers)
    .filter(([, v]) => v)
    .map(([k]) => allClassNames[k])
    .filter(Boolean)
    .join(" ")
  const dayClassName = cn(classNames?.day, modifierClasses)

  const item = data.get(normalizeDate(day.date))
  const count = item?.count ?? "No"
  const level = item?.level ?? 0

  return (
    <Tooltip key={`${day.isoDate}_${day.displayMonthId}`}>
      <TooltipTrigger
        render={
          <Day
            {...props}
            day={day}
            modifiers={modifiers}
            className={dayClassName}
            style={styles?.day}
            role="gridcell"
            data-level={level.toString()}
            // using modifiers don't work cause dates don't exist in data
            data-hidden={day.date > new Date() || day.date < firstDay}
          >
            {formatters.formatDay(day.date, day.dateLib.options, day.dateLib)}
          </Day>
        }
      />
      <TooltipContent>
        {`${count} activities on ${day.date.toDateString()}`}
      </TooltipContent>
    </Tooltip>
  )
}

const HeatmapTrackerLegend = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { classNames } = useHeatmapTracker()

  const LEVEL_CLASSES = [
    "bg-(--level-0)",
    "bg-(--level-1)",
    "bg-(--level-2)",
    "bg-(--level-3)",
    "bg-(--level-4)",
  ]

  return (
    <div
      className={cn(
        "flex w-full justify-end space-x-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <span>less</span>
      <div className="flex items-center space-x-1">
        {LEVEL_CLASSES.map((levelClassName, index) => (
          <div
            key={index}
            data-level={index.toString()}
            className={cn(
              "size-(--day-size) rounded-sm",
              levelClassName,
              classNames?.day
            )}
          />
        ))}
      </div>
      <span>more</span>
    </div>
  )
}

export {
  HeatmapTracker,
  HeatmapTrackerContainer,
  HeatmapTrackerLegend,
  type HeatmapTrackerData,
}

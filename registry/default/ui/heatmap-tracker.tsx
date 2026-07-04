"use client"

import { Calendar } from "@/registry/default/ui/calendar"
import {
  Tooltip,
  TooltipContent,
  TooltipCreateHandle,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip"
import { cn } from "@/lib/utils"
import { enUS } from "date-fns/locale"
import * as React from "react"
import {
  Day,
  DayPickerProps,
  useDayPicker,
  WeekNumber,
  type DayProps,
  type WeekProps,
} from "react-day-picker"

const DAY_SIZE = "calc(var(--spacing)*4.5)"
const DAY_MARGIN = "2px"

const normalizeDate = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

const SHAPES = {
  triangle: "polygon(50% 0%,100% 100%,0% 100%)",
  hexagon: "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
  circle: "circle(50% at 50% 50%)",
  square: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
  diamond: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
  pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  x: "polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)",
  plus: "polygon(0 35%, 35% 35%, 35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%)",
} as const

type HeatmapShape = keyof typeof SHAPES

interface HeatmapTrackerData {
  date: Date
  count: number
  level: number | null
}

const HeatmapTracker = ({
  data,
  isLoading = false,
  lightColors = [],
  darkColors = [],
  shapes = [],
  style,
  className,
  classNames,
  components,
  locale = enUS,
  legendAlign,
  ...props
}: React.ComponentProps<typeof Calendar> & {
  data: HeatmapTrackerData[]
  isLoading?: boolean
  lightColors?: string[]
  darkColors?: string[]
  shapes?: HeatmapShape[]
  children?: React.ReactNode
  legendAlign?: "start" | "center" | "end"
}) => {
  const formatCaption = (date: Date) =>
    date.toLocaleString(locale?.code, { month: "short" })

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
  }, [data])

  const tooltipHandle = React.useMemo(
    () => TooltipCreateHandle<React.ComponentType>(),
    []
  )

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
          //shapes
          "--default-shape": SHAPES.square,
          "--shape-0": SHAPES[shapes[0]] ?? "var(--default-shape)",
          "--shape-1": SHAPES[shapes[1]] ?? "var(--default-shape)",
          "--shape-2": SHAPES[shapes[2]] ?? "var(--default-shape)",
          "--shape-3": SHAPES[shapes[3]] ?? "var(--default-shape)",
          "--shape-4": SHAPES[shapes[4]] ?? "var(--default-shape)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "flex w-fit flex-col gap-y-2 p-2",
        "[--level-0:var(--level-0-light)] dark:[--level-0:var(--level-0-dark)]",
        "[--level-1:var(--level-1-light)] dark:[--level-1:var(--level-1-dark)]",
        "[--level-2:var(--level-2-light)] dark:[--level-2:var(--level-2-dark)]",
        "[--level-3:var(--level-3-light)] dark:[--level-3:var(--level-3-dark)]",
        "[--level-4:var(--level-4-light)] dark:[--level-4:var(--level-4-dark)]",
        className
      )}
    >
      <div className="overflow-x-scroll p-2 md:flex md:items-center md:justify-center">
        <TooltipProvider>
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
              caption_label: cn(
                "text-xs font-normal",
                classNames?.caption_label
              ),
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
                "m-(--day-margin) size-(--day-size) rounded-sm border border-border/20 bg-muted text-xs text-transparent",
                "data-[hidden=true]:hidden",
                classNames?.day
              ),
              outside: cn("text-xs text-transparent", classNames?.outside),
              today: cn(
                "m-(--day-margin) size-(--day-size) rounded-sm border border-border/20 bg-muted text-xs text-transparent",
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
                  tooltipHandle={tooltipHandle}
                  {...props}
                />
              ),
              ...components,
            }}
            {...props}
          />

          <Tooltip handle={tooltipHandle}>
            {({ payload: Payload }) => (
              <TooltipContent className="animate-none">
                {Payload !== undefined && <Payload />}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <HeatmapTrackerLegend
        classNames={classNames}
        isLoading={isLoading}
        align={legendAlign}
      />
    </div>
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
  tooltipHandle,
  ...props
}: DayProps & {
  data: Map<number, HeatmapTrackerData>
  firstDay: Date
  tooltipHandle: ReturnType<typeof TooltipCreateHandle<React.ComponentType>>
}) {
  const { classNames, styles, dayPickerProps, formatters } = useDayPicker()

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
  const level = item?.level ?? undefined

  return (
    <TooltipTrigger
      key={`${day.isoDate}_${day.displayMonthId}`}
      render={
        <Day
          {...props}
          day={day}
          modifiers={modifiers}
          className={cn(
            dayClassName, //shapes
            "data-[level=0]:[clip-path:var(--shape-0)]",
            "data-[level=1]:[clip-path:var(--shape-1)]",
            "data-[level=2]:[clip-path:var(--shape-2)]",
            "data-[level=3]:[clip-path:var(--shape-3)]",
            "data-[level=4]:[clip-path:var(--shape-4)]"
          )}
          style={styles?.day}
          role="gridcell"
          data-level={level}
          // using modifiers don't work cause dates don't exist in data
          data-hidden={day.date > new Date() || day.date < firstDay}
        />
      }
      handle={tooltipHandle}
      payload={() => `${count} activities on ${day.date.toDateString()}`}
    >
      {formatters.formatDay(day.date, day.dateLib.options, day.dateLib)}
    </TooltipTrigger>
  )
}

const HeatmapTrackerLegend = ({
  className,
  classNames,
  isLoading = false,
  align = "end",
  ...props
}: React.ComponentProps<"div"> & {
  classNames?: DayPickerProps["classNames"]
  isLoading?: boolean
  align?: "start" | "center" | "end"
}) => {
  const LEVEL_CLASSES = [
    "data-[level=0]:bg-(--level-0) data-[level=0]:[clip-path:var(--shape-0)]",
    "data-[level=1]:bg-(--level-1) data-[level=1]:[clip-path:var(--shape-1)]",
    "data-[level=2]:bg-(--level-2) data-[level=2]:[clip-path:var(--shape-2)]",
    "data-[level=3]:bg-(--level-3) data-[level=3]:[clip-path:var(--shape-3)]",
    "data-[level=4]:bg-(--level-4) data-[level=4]:[clip-path:var(--shape-4)]",
  ]

  return (
    <div
      data-align={align}
      className={cn(
        "flex w-full space-x-2 text-sm text-muted-foreground",
        "data-[align=center]:justify-center data-[align=end]:justify-end data-[align=start]:justify-start",
        className
      )}
      {...props}
    >
      <span>less</span>
      <div className="flex items-center space-x-1">
        {LEVEL_CLASSES.map((levelClassName, index) => (
          <div
            key={index}
            data-level={isLoading ? "null" : index.toString()}
            className={cn(
              "size-(--day-size) rounded-sm data-[level=null]:bg-muted",
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

export { HeatmapTracker, HeatmapTrackerLegend, type HeatmapTrackerData }

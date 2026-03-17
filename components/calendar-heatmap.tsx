// Original code: https://github.com/sp-yduck/shadcn-ui-calendar-heatmap/tree/main

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
  type CalendarWeek,
} from "react-day-picker"

const DAY_SIZE = "calc(var(--spacing)*4.5)"
const DAY_MARGIN = "2px"

interface CalendarHeatmapContextValue {}

const CalendarHeatmapContext = React.createContext<
  CalendarHeatmapContextValue | undefined
>(undefined)

export const useCalendarHeatmap = () => {
  const context = React.useContext(CalendarHeatmapContext)
  if (!context) {
    throw new Error(
      "useCalendarHeatmap must be used within a CalendarHeatmapContainer"
    )
  }
  return context
}

const CalendarHeatmapContainer = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <CalendarHeatmapContext.Provider value={{}}>
      <div
        className={cn(
          "flex w-fit flex-col gap-y-4 overflow-x-scroll p-2 [--level-0:var(--color-gray-50)] [--level-1:var(--color-lime-200)] [--level-2:var(--color-lime-400)] [--level-3:var(--color-lime-600)] [--level-4:var(--color-lime-800)]",
          className
        )}
        style={
          {
            "--box-size": DAY_SIZE,
            "--box-margin": DAY_MARGIN,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </CalendarHeatmapContext.Provider>
  )
}

export interface CalendarHeatmapData {
  date: Date
  count: number
  intensity: number
}

const CalendarHeatmap = ({
  data,
  locale,
  ...props
}: React.ComponentProps<typeof Calendar> & {
  data: Array<{
    date: Date
    count: number
    intensity: number
  }>
}) => {
  const formatCaption = (date: Date) =>
    date.toLocaleString(locale?.code, { month: "short" })
  const elevenMonthAgo = new Date(
    new Date().setMonth(new Date().getMonth() - 11)
  )
  const heatmapModify = () => {
    const zero: Date[] = []
    const one: Date[] = []
    const two: Date[] = []
    const three: Date[] = []
    const four: Date[] = []
    for (const item of data) {
      if (item.intensity === 0) {
        zero.push(item.date)
      } else if (item.intensity === 1) {
        one.push(item.date)
      } else if (item.intensity === 2) {
        two.push(item.date)
      } else if (item.intensity === 3) {
        three.push(item.date)
      } else if (item.intensity === 4) {
        four.push(item.date)
      }
    }
    return {
      zero: zero,
      one: one,
      two: two,
      three: three,
      four: four,
    }
  }

  return (
    <Calendar
      formatters={{ formatCaption }}
      locale={locale}
      numberOfMonths={12}
      defaultMonth={elevenMonthAgo}
      hideWeekdays
      className="w-fit items-center justify-center p-0"
      classNames={{
        root: "w-auto",
        nav: "hidden",
        caption: "text-xs",
        caption_label: "font-normal",
        month: "ml-0 w-fit",
        month_caption: "h-fit px-0",
        months: "gap-0 w-fit",
        month_grid: "w-fit",
        weeks: "flex w-fit",
        week: "select-none flex mt-0 flex-col data-[duplicated-previous-month=true]:hidden",
        day: "w-(--box-size) h-(--box-size) m-(--box-margin) bg-muted border border-border/20 rounded-sm text-xs text-transparent",
        day_outside:
          "text-transparent bg-transparent border border-transparent",
        day_today: "border border-black text-transparent",
      }}
      modifiers={heatmapModify()}
      modifiersClassNames={{
        zero: "bg-(--level-0)",
        one: "bg-(--level-1)",
        two: "bg-(--level-2)",
        three: "bg-(--level-3)",
        four: "bg-(--level-4)",
      }}
      components={{
        Week: (props) => <CustomWeek week={props.week} data={data} />,
      }}
      {...props}
    />
  )
}

interface CustomWeekProps {
  week: CalendarWeek
  data: CalendarHeatmapData[]
}

function CustomWeek({ week, data }: CustomWeekProps) {
  const {
    getModifiers,
    components,
    classNames,
    styles,
    formatters,
    dayPickerProps,
  } = useDayPicker()

  const DayComponent = components?.Day ?? Day
  const WeekNumberComponent = components?.WeekNumber ?? WeekNumber
  const showWeekNumber = dayPickerProps.showWeekNumber ?? false

  const displayMonth = week.days[0]?.displayMonth
  const monthOfLastDay = week.days[6]?.date.getMonth()
  const monthOfFirstDay = week.days[0]?.date.getMonth()
  const thisMonth = displayMonth?.getMonth()

  const modifierClassNames = dayPickerProps.modifiersClassNames ?? {}

  return (
    <tr
      data-duplicated-next-month={thisMonth !== monthOfLastDay}
      data-duplicated-previous-month={thisMonth !== monthOfFirstDay}
      className={classNames?.week}
      style={styles?.week}
    >
      {showWeekNumber && (
        <WeekNumberComponent
          week={week}
          className={classNames?.week_number}
          style={styles?.week_number}
        />
      )}
      {week.days.map((day) => {
        const modifiers = getModifiers(day)
        const modifierClasses = Object.entries(modifiers)
          .filter(([, v]) => v)
          .map(([k]) => modifierClassNames[k])
          .filter(Boolean)
          .join(" ")
        const dayClassName = cn(classNames?.day, modifierClasses)
        const count =
          data.find(
            (item) => item.date.toDateString() === day.date.toDateString()
          )?.count ?? "No"

        return (
          <Tooltip key={`${day.isoDate}_${day.displayMonthId}`}>
            <TooltipTrigger
              render={
                <DayComponent
                  day={day}
                  modifiers={modifiers}
                  className={dayClassName}
                  style={styles?.day}
                  role="gridcell"
                >
                  {formatters.formatDay(
                    day.date,
                    day.dateLib.options,
                    day.dateLib
                  )}
                </DayComponent>
              }
            />
            <TooltipContent>
              {`${count} activities on ${day.date.toDateString()}`}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </tr>
  )
}

const CalendarHeatmapLegend = () => {
  return (
    <div className="flex w-full justify-end space-x-2 text-sm text-muted-foreground">
      <span>less</span>
      <div className="flex items-center space-x-1">
        <div
          className={cn(
            "h-(--box-size) w-(--box-size) rounded-sm bg-(--level-0)"
          )}
        />
        <div
          className={cn(
            "h-(--box-size) w-(--box-size) rounded-sm bg-(--level-1)"
          )}
        />
        <div
          className={cn(
            "h-(--box-size) w-(--box-size) rounded-sm bg-(--level-2)"
          )}
        />
        <div
          className={cn(
            "h-(--box-size) w-(--box-size) rounded-sm bg-(--level-3)"
          )}
        />
        <div
          className={cn(
            "h-(--box-size) w-(--box-size) rounded-sm bg-(--level-4)"
          )}
        />
      </div>
      <span>more</span>
    </div>
  )
}

export { CalendarHeatmap, CalendarHeatmapContainer, CalendarHeatmapLegend }

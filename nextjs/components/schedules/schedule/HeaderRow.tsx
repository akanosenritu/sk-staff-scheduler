import {DateRange} from "../../../types/dateRange"
import styles from "./row.module.css"
import {eachDayOfInterval, eachMonthOfInterval, format} from "date-fns"
import clsx from "clsx"
import {useMemo} from "react"

export const HeaderRow = (props: {range: DateRange}) => {
  const data = useMemo(() => {
    const months = eachMonthOfInterval(props.range)
    const days = eachDayOfInterval(props.range)
    const dayStrings = days.map(date => format(date, "d"))
    const daysInMonth: {[month: number]: number} = Object.fromEntries(months.map(month => [month.getMonth()+1, 0]))
    for (const day of days) {
      daysInMonth[day.getMonth() + 1] += 1
    }
    return {months, days, dayStrings, daysInMonth}
  }, [props.range])

  return <>
    <div className={styles.rowContainer}>
      <div className={clsx(styles.usernameColumn, styles.headerRow)}></div>
      <div>
        <div style={{display: "flex"}}>
          {data.months.map(month => month.getMonth()+1).map(month => (
            <div style={{width: 30 * data.daysInMonth[month]}} key={month} className={clsx(styles.monthColumn)}>{month}</div>
          ))}
        </div>
        <div style={{display: "flex"}}>
          {data.dayStrings.map((dayString, index) => (
            <div className={clsx(styles.dayColumn, styles.header)} key={dayString + index}>
              {dayString}
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
}
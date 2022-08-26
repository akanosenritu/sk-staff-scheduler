import {CosmosDBScheduleItem, DayScheduleStatus, User} from "shared/dist/types"
import styles from "./row.module.css"
import clsx from "clsx"

const getText = (scheduleStatus: DayScheduleStatus): string => {
  switch (scheduleStatus) {
    case "available":
      return "O"
    case "notAvailable":
      return "X"
    case "toBeDetermined":
      return "?"
    default:
      return ""
  }
}

const getColor = (scheduleStatus: DayScheduleStatus): string => {
  switch (scheduleStatus) {
    case "available":
      return "rgba(40, 167, 69, 0.3)"
    case "notAvailable":
      return "rgba(220, 53, 69, 0.3)"
    case "toBeDetermined":
      return "rgba(255, 193, 7, 0.3)"
  }
}

export const ScheduleRow = (props: {scheduleItem: CosmosDBScheduleItem, user: User, dayStrings: string[]}) => {
  const schedule = props.scheduleItem.schedule
  const currentSchedule = schedule.current.data
  return <div className={clsx(styles.rowContainer)}>
    <div className={clsx(styles.usernameColumn)}>{props.user.displayName}</div>
    {props.dayStrings.map(dayString => {
      return <div className={clsx(styles.dayColumn)} key={dayString} style={{backgroundColor: getColor(currentSchedule[dayString])}}>{getText(currentSchedule[dayString])}</div>
    })}
  </div>
}
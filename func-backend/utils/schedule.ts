import {CosmosDBScheduleItem, Schedule, ScheduleData} from "../types/Schedule"
import {format, utcToZonedTime} from "date-fns-tz"

export const createScheduleItem = (userId: string, data: ScheduleData): CosmosDBScheduleItem => {
  const today = utcToZonedTime(new Date(), "Asia/Tokyo")
  const nowString = format(today, "yyyy-MM-dd'T'HH:mm:ssxxx", {timeZone: "Asia/Tokyo"})
  return {
    id: userId,
    schedule: {
      current: data,
      updatedAt: nowString,
      updateLogs: [{
        date: nowString,
        updatedWith: data,
        currentAtTheTime: {
          data: {}
        }
      }]
    }
  }
}

export const updateCurrent = (oldCurrent: ScheduleData, newData: ScheduleData): ScheduleData => {
  return {
    memo: newData.memo,
    data: {...oldCurrent.data, ...newData.data}
  }
}

export const updateSchedule = (oldSchedule: Schedule, data: ScheduleData): Schedule => {
  const today = utcToZonedTime(new Date(), "Asia/Tokyo")
  const nowString = format(today, "yyyy-MM-dd'T'HH:mm:ssxxx", {timeZone: "Asia/Tokyo"})
  return {
    current: updateCurrent(oldSchedule.current, data),
    updatedAt: nowString,
    updateLogs: [...oldSchedule.updateLogs, {date: nowString, updatedWith: data, currentAtTheTime: oldSchedule.current}]
  }
}
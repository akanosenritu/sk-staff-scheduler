
export type ISOFormattedDateString = string  // ISO-8601
export type DayString = string  // format: yyyy-MM-dd
export type DayScheduleStatus = "available" | "notAvailable" | "toBeDetermined"
export type ScheduleData = {
  memo?: string,
  data: {
    [dayString: DayString]: DayScheduleStatus,
  }
}
export type UpdateLog = {
  date: ISOFormattedDateString,
  updatedWith: ScheduleData,
  currentAtTheTime: ScheduleData
}

export type Schedule = {
  current: ScheduleData,
  updateLogs: UpdateLog[],
  updatedAt: ISOFormattedDateString,
}
export type CosmosDBScheduleItem = {
  id: string,
  schedule: Schedule,
}
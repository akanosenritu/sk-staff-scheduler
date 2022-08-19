import React from "react"
import { Box, Typography } from "@mui/material"
import { format, formatISO, getDate, isToday, isBefore } from "date-fns"
import ja from "date-fns/locale/ja"
import { DayScheduleStatus, getNextStatus, useDaySchedulesStore } from "./useDaySchedulesStore"

const getBackgroundColor = (status: DayScheduleStatus, beforeToday: boolean) => {
  if (beforeToday) return "lightgray"
  switch (status) {
    case "available":
      return "rgba(40, 167, 69, 0.3)"
    case "notAvailable":
      return "rgba(220, 53, 69, 0.3)"
    case "toBeDetermined":
      return "rgba(255, 193, 7, 0.3)"
  }
}

const DayScheduleStatusDisplay = (props: {status: DayScheduleStatus}) => {
  return <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", "&>img": {width: "60%"}, mt: 1}}>
    {props.status === "available" &&  <img src="circle.png" />}
    {props.status === "notAvailable" && <img src="cross.png" />}
    {props.status === "toBeDetermined" && <img src="triangle.png" />}
  </Box>
}

export const DayContainer = (props: {children: React.ReactNode, isHeader?: boolean}) => {
  return <Box sx={{
    width: "14.2vw",
    height: props.isHeader? "3rem": "14.2vw",
    maxWidth: 100, 
    maxHeight: 100,
    aspectRatio: props.isHeader? undefined: "1 / 1", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    borderTop: props.isHeader? "1px solid darkgray": "",
    borderBottom: "1px solid darkgray"
  }}>
    {props.children}
  </Box> 
}

export const Day = (props: {day: Date, showMonth?: boolean}) => {
  const dayString = React.useMemo(() => formatISO(props.day), [props.day])
  const beforeToday = React.useMemo(() => isBefore(props.day, new Date()), [props.day])
  const {status, update} = useDaySchedulesStore(state => ({status: state.daySchedules[dayString], update: state.updateDaySchedule}))
  const onClick = () => {
    if (beforeToday) return
    update(dayString, getNextStatus(status))
  }
  const isStartOfMonth = getDate(props.day) === 1
  return <DayContainer>
    <Box sx={{textAlign: "center", color: isToday(props.day)? "green": "black", fontWeight: isToday(props.day)? "bold": "normal", position: "absolute"}}>
      <Typography variant="body2">{format(props.day, isStartOfMonth || props.showMonth? "M/d": "d", {locale: ja})}</Typography>
    </Box>
    <Box sx={{backgroundColor: getBackgroundColor(status, beforeToday), width: "100%", height: "100%"}} onClick={onClick}>
      <DayScheduleStatusDisplay status={status}/>
    </Box>
  </DayContainer>
}
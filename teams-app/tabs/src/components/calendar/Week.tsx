import React from "react"
import { Box } from "@mui/material"
import {addDays, formatISO} from "date-fns"
import { Day } from "./Day"

const getDays = (start: Date): Date[] => {
  return [
    start,
    addDays(start, 1),
    addDays(start, 2),
    addDays(start, 3),
    addDays(start, 4),
    addDays(start, 5),
    addDays(start, 6),
  ]
}

export const Week = (props: {start: Date}) => {
  const days = React.useMemo(() => getDays(props.start), [props.start])
  return <Box sx={{display: "flex", "&>.MuiBox-root": {borderRight: "1px solid darkgray"}, "&>.MuiBox-root:first-child": {borderLeft: "1px solid darkgray"}, width: "100%"}}>
    {days.map(day => <Day key={formatISO(day)} day={day}/>)}
  </Box>
}
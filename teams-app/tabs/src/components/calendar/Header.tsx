import { Box, Typography } from "@mui/material"
import { DayContainer } from "./Day"

const days = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土"
]

const Day = (props: {day: string}) => {
  return <DayContainer isHeader={true}>
    <Box sx={{textAlign: "center", fontWeight: "bold"}}>
      <Typography variant="body2">{props.day}</Typography>
    </Box>
  </DayContainer>
}

export const Header = (props: {}) => {
  return <Box sx={{display: "flex", "&>.MuiBox-root": {borderRight: "1px solid darkgray"}, "&>.MuiBox-root:first-child": {borderLeft: "1px solid darkgray"}, width: "100%"}}>
    {days.map(day => <Day key={day} day={day} />)}
</Box>
}
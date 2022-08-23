import {Box, Button, Stack, TextField} from "@mui/material"
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns"
import {SettingsTitle} from "./Title"
import {useState} from "react"
import {Description} from "./Description"
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers"
import {addDays, isBefore} from "date-fns"
import jaLocale from "date-fns/locale/ja"
import {DateRange} from "../../types/dateRange"

type Error = {start?: string, end?: string}
const checkRange = (start: Date, end: Date): Error | null => {
  if (isBefore(start, addDays(new Date(), -1))) return {start: "過去の日付は編集できません。"}
  if (isBefore(end, start)) return {end: "終了日は開始日より後である必要があります。"}
  return null
}

export const RangeSelector = (props: {
  initialRange: DateRange,
  onSave: (range: DateRange) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<DateRange>(props.initialRange)
  const [error, setError] = useState<Error|null>(null)
  const onChange = (target: "start" | "end", newDate: Date | null) => {
    if (!newDate) return
    // @ts-ignore
    const {start, end} = {...selected, [target]: newDate}
    const checkResult = checkRange(start, end)
    setSelected({start, end})
    setError(checkResult)
  }
  const onSave = () => {
    if (error) return
    props.onSave({start: selected.start, end: selected.end})
  }
  console.log(error)
  return <Box sx={{p: 1, width: 500, maxWidth: "90vw", "& .MuiBox-root": {p: 1}, backgroundColor: "white", borderRadius: 3}}>
    <SettingsTitle title={"期間を選択"} isOpen={isOpen} onClickOpen={()=>setIsOpen(!isOpen)} />
    <Description description={"対象とする期間を選択します。"} />
    <Box sx={{display: isOpen? "block": "none"}}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={jaLocale}>
        <Stack spacing={1} direction={{xs: "column", md: "row"}} sx={{alignItems: "center"}}>
          <DesktopDatePicker key={"start"} onChange={value => onChange("start", value)} value={selected.start} renderInput={params => <TextField {...params} size={"small"} />} />
          <Box>～</Box>
          <DesktopDatePicker key={"end"} onChange={value => onChange("end", value)} value={selected.end} renderInput={params => <TextField {...params} size={"small"} />} />
        </Stack>
      </LocalizationProvider>
    </Box>
    {isOpen && <Box sx={{display: "flex", justifyContent: "end"}}>
      <Button color={"success"} variant={"contained"} onClick={onSave}>保存</Button>
    </Box>}
  </Box>
}
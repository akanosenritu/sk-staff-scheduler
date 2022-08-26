import {Box, CircularProgress, Stack} from "@mui/material"
import {GroupSelector} from "../../schedules/groups/GroupSelector"
import {RangeSelector} from "../../schedules/RangeSelector"
import {useUser} from "../../../hooks/useUser"
import {useState} from "react"
import {Group} from "shared/dist/types"
import {DisplaySchedulesByGroup} from "../../schedules/DisplaySchedulesByGroup"
import {addDays} from "date-fns"
import {DateRange} from "../../../types/dateRange"

export const Manage = () => {
  const {data: user, isLoggedOut} = useUser()
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([])

  const [range, setRange] = useState<DateRange>({start: new Date(), end: addDays(new Date(), 30)})

  if (isLoggedOut) {
    return <Box>ログインしてください。</Box>
  }
  if (!user) {
    return <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
      <CircularProgress />
    </Box>
  }

  return <Stack spacing={3} direction={"column"}>
    <Box>
      <Stack spacing={1} direction={{xs: "column", "md": "row"}} sx={{alignItems: "flex-start"}}>
        <GroupSelector onSave={groups => setSelectedGroups(groups)}/>
        <RangeSelector onSave={range => setRange(range)} initialRange={range} />
      </Stack>
    </Box>
    <hr />
    <Stack spacing={1}>
      {selectedGroups.map(group => <DisplaySchedulesByGroup key={group.id} group={group} range={range} />)}
    </Stack>
  </Stack>
}
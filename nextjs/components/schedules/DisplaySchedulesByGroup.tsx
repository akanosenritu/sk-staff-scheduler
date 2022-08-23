import {Box, Typography} from "@mui/material"
import {FuncBackendGetUserSchedulesByGroupResponse} from "shared/types/funcBackendResponses"
import useSwr from "swr"
import {DisplaySchedulesTitle} from "./Title"
import {Group} from "shared/types/group"
import {Description} from "./Description"
import {ScheduleRow} from "./schedule/ScheduleRow"
import {CosmosDBScheduleItem} from "shared/types/schedule"
import {User} from "shared/types/user"
import {useMemo} from "react"
import {DateRange} from "../../types/dateRange"
import {eachDayOfInterval, format} from "date-fns"
import {HeaderRow} from "./schedule/HeaderRow"

const fetcher = (url: string) => fetch(url).then(res => res.json())

type RowData = {scheduleItem: CosmosDBScheduleItem, user: User}

export const DisplaySchedulesByGroup = (props: {
  group: Group,
  range: DateRange
}) => {
  const {data} = useSwr<FuncBackendGetUserSchedulesByGroupResponse>(`/api/backend/getUserSchedulesByGroup/${props.group.id}`, fetcher)
  const rowData: RowData[] = useMemo(() => {
    if (!data) return []
    return data.schedules
      .map(schedule => ({item: schedule, user: data.users.find(user => user.id === schedule.id)}))
      .filter(e => e.user)
      .map(e => ({scheduleItem: e.item, user: e.user} as RowData))
  }, [data])

  const rangeDayStrings = useMemo(() => {
    const dates = eachDayOfInterval(props.range)
    return dates.map(date => format(date, "yyyy-MM-dd"))
  }, [props.range])

  return <Box sx={{p: 1, width: "100%", maxWidth: "90vw", "& .MuiBox-root": {p: 1}, backgroundColor: "white", borderRadius: 3}}>
    <DisplaySchedulesTitle title={props.group.displayName} />
    <Description description={"グループ内のユーザーのうち、スケジュールを提出しているユーザーのみを表示します。"} />
    {data && data.schedules.length === 0 && <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Typography variant={"body1"} sx={{fontWeight: "bold"}}>このグループにはスケジュールを提出しているユーザーがいません。</Typography>
    </Box>}
    <Box sx={{overflowX: "scroll", m: 1}}>
      <Box sx={{display: "table"}}>
        {rowData.length > 0 && <HeaderRow range={props.range} />}
        {rowData.map(rowDatum => {
          return <ScheduleRow key={rowDatum.scheduleItem.id} scheduleItem={rowDatum.scheduleItem} user={rowDatum.user} dayStrings={rangeDayStrings}/>
        })}
      </Box>
    </Box>
  </Box>
}
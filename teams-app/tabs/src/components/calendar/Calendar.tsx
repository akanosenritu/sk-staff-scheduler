import {Box, Button, Typography} from "@mui/material"
import {formatISO} from "date-fns"
import {TeamsFx} from "@microsoft/teamsfx"
import {Week} from "./Week"
import {convertDaySchedulesToScheduleData, datesToBeDrawn, useDaySchedulesStore} from "./useDaySchedulesStore"
import {Header} from "./Header"
import useSWR from "swr"
import {useSnackbar} from "notistack"
import {CosmosDBScheduleItem, ScheduleData} from "shared/dist/types"

const teamsfx = new TeamsFx()

const API_ENDPOINT = "https://tabssodeve7a2ddapi.azurewebsites.net/api/userSchedule"

const fetchGetter = async (url: string) => {
  const accessToken = await teamsfx.getCredential().getToken("")
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken?.token}`
    }
  })
  if (res.status !== 404 && !res.ok) {
    throw new Error("failed to fetch the data")
  } 
  
  return (await res.json()).data
}

export const Calendar = () => {
  const daySchedules = useDaySchedulesStore(state => state.daySchedules)
  const setDaySchedules = useDaySchedulesStore(state => state.setDaySchedules)
  
  // retrieve the schedule from api
  const {data, error} = useSWR<CosmosDBScheduleItem>(API_ENDPOINT, fetchGetter, {errorRetryCount: 3, onSuccess: data => {
    try {
      setDaySchedules(data.schedule.current.data)
    } catch (e) {
      console.log(e)
    }
  }})

  // setting for snackbar
  const {enqueueSnackbar} = useSnackbar()

  // if the save button is clicked, post the current schedules data to api,
  // and notify the user of the result.
  const onClickSave = async () => {
    const data: ScheduleData = {
      data: convertDaySchedulesToScheduleData(daySchedules)
    }
    const accessToken = await teamsfx.getCredential().getToken("")
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      enqueueSnackbar("保存されました", {variant: "success"})
    } else {
      enqueueSnackbar("保存に失敗しました", {variant: "error"})
    }
  }

  if (error) return <Box>読み込みに失敗しました。{JSON.stringify(error)}</Box>
  if (!data) return <Box>読込中...</Box>
  return <Box sx={{"&>.MuiBox-root": {mb: 2}, mx: 1, width: "100%"}}>
    <Box>
      <Typography variant="body2">カレンダー上をクリックすることで、その日の予定を設定できます。編集が終わったら保存を押してください。</Typography>
    </Box>
    <Box>
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
        <Header />
        {datesToBeDrawn.weeks.map(week => <Week key={formatISO(week.start)} start={week.start} />)}
      </Box>
    </Box>
    <Box sx={{display: "flex", justifyContent: "center"}}>
      <Button variant="contained" color="success" size="small" onClick={onClickSave}>保存</Button>
    </Box>
  </Box>
}
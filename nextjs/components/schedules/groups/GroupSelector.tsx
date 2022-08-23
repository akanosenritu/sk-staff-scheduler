import {Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel} from "@mui/material"
import {FuncBackendGetGroupsResponse} from "shared/types/funcBackendResponses"
import useSwr from "swr"
import {SettingsTitle} from "../Title"
import {ChangeEvent, useMemo, useState} from "react"
import {Description} from "../Description"
import {Group} from "shared/types/group"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const GroupSelector = (props: {onSave: (selectedGroups: Group[]) => void}) => {
  const {data} = useSwr<FuncBackendGetGroupsResponse>("/api/backend/getGroups", fetcher)

  // sort the groups and memorize the result
  const groups = useMemo(() => {
    if (!data) return []
    const groups = [...data.groups]
    groups.sort((a, b) => a.displayName > b.displayName ? 1: -1)
    return groups
  }, [data])

  const [isOpen, setIsOpen] = useState(false)

  const [selected, setSelected] = useState<{[id: string]: boolean}>({})
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelected({
      ...selected,
      [event.target.id]: event.target.checked
    })
  }
  const onSave = () => {
    props.onSave(groups.filter(group => selected[group.id]))
  }

  return <Box sx={{p: 1, width: 500, maxWidth: "90vw", "& .MuiBox-root": {p: 1}, backgroundColor: "white", borderRadius: 3}}>
    <SettingsTitle title={"グループを選択"} isOpen={isOpen} onClickOpen={() => setIsOpen(!isOpen)} />
    <Description description={"対象とするグループを選択します。"} />
    <Box sx={{display: isOpen? "block": "none"}}>
      {!data && <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress />
      </Box>}
      {groups && <Box>
        <FormControl>
          {groups.map(group => {
            return <FormControlLabel control={<Checkbox onChange={onChange} id={group.id} />} label={group.displayName} key={group.id}/>
          })}
        </FormControl>
      </Box>}
    </Box>
    {isOpen && <Box sx={{display: "flex", justifyContent: "end"}}>
      <Button color={"success"} variant={"contained"} onClick={onSave}>保存</Button>
    </Box>}
  </Box>
}
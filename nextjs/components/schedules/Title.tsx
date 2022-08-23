import {Box, IconButton} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

export const TitleBase = (props: {
  title: string,
  color: string,
  backgroundColor: string,
  expandProps?: {
    isExpanded: boolean,
    onClickExpand: () => void,
  }
  }) => {
  return <Box sx={{backgroundColor: props.backgroundColor, color: props.color, width: "100%", p: 1, display: "flex", alignItems: "center", borderRadius: 3}}>
    <Box sx={{flexGrow: 1}}>
      {props.title}
    </Box>
    {props.expandProps && <IconButton size={"small"} onClick={props.expandProps.onClickExpand}>
      {props.expandProps.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </IconButton>}
  </Box>
}

export const SettingsTitle = (props: {title: string, isOpen: boolean, onClickOpen: () => void}) => {
  return <TitleBase title={props.title} expandProps={{isExpanded: props.isOpen, onClickExpand: props.onClickOpen}} color={"white"} backgroundColor={"slategray"} />
}

export const DisplaySchedulesTitle = (props: {title: string}) => {
  return <TitleBase title={props.title} color={"white"} backgroundColor={"chocolate"} />
}
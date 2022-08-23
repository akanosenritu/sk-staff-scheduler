import {Box, Typography} from "@mui/material"

export const Description = (props: {description: string}) => {
  return <Box>
    <Typography variant={"body2"}>{props.description}</Typography>
  </Box>
}
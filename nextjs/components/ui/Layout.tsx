import {Box} from "@mui/material"
import {AppBar} from "./AppBar"
import React from "react"

export const Layout = (props: {children: React.ReactNode}) => {
  return <Box sx={{backgroundColor: "gainsboro", minHeight: "100vh"}}>
    <AppBar />
    <Box sx={{maxWidth: 1200, marginLeft: "auto", marginRight: "auto", p: 1}}>
      {props.children}
    </Box>
  </Box>
}
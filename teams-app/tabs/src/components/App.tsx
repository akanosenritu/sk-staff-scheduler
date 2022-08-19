import Tab from "./Tab"
import "./App.css"
import { Box, Container } from "@mui/material"
import { SnackbarProvider } from "notistack"

/**
 * The main app which handles the initialization and routing
 * of the app.
 */

export default function App() {  
  return <SnackbarProvider>
    <Container maxWidth="md" sx={{display: "flex", justifyContent: "center", height: "100%"}}>
      <Box>
        <Tab />
      </Box>
    </Container>
  </SnackbarProvider>
}

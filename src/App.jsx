import List from './components/List.jsx'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
  return (
    <Container maxWidth="xl">
      <AppBar position='static'>
        <Toolbar>
          <Typography variant="h6">Personal Trainer</Typography>
        </Toolbar>
      </AppBar>
      <List />
      <CssBaseline />
    </Container>
  )
}

export default App

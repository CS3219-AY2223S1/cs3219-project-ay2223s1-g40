import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import {Routes, Route, useNavigate} from 'react-router-dom';
import CountdownPage from '../CountdownPage/CountdownPage';
import io from 'socket.io-client';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.nus.edu.sg/">
        National University of Singapore
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();
const socket = io();


export default function DifficultyPage() {

  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(checked[1]); // Submits the difficulty chosen -> checked[1]
    navigate('/countdown'); // Redirects to countdown page
  };

  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [checked];
    

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log(checked)
    setChecked(newChecked);
  };

  // The Client Communication
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }

  // Webpage Render
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/*The Title*/}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <StickyNote2RoundedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome to PeerPrep!
          </Typography>
          <Typography component="subtitle1" align="center">
            In order to ensure a customized experience, please choose the difficulty of the interview questions
            you would like to see.
          </Typography>
        
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

          {/*The List*/}
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {['Beginner', 'Intermediate', 'Advanced'].map((value) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                <ListItem
                    key={value}
                    secondaryAction={
                      <IconButton edge="end">
                      </IconButton>
                      }
                    disablePadding
                    >
                    <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                    <ListItemIcon>
                        <Checkbox
                        edge="start"
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemText id={1} primary={value} />
                    </ListItemButton>
                </ListItem>
                );
            })}
            </List>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />

        <Routes>
          <Route path="/countdown" element={<CountdownPage />} />
        </Routes>

        <div>
        <p>Connected: { '' + isConnected }</p>
        <p>Last pong: { lastPong || '-' }</p>
        <button onClick={ sendPing }>Send ping</button>
        </div>

      </Container>
    </ThemeProvider>
  );
}

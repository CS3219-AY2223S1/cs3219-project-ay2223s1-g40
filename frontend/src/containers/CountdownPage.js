import React, { useContext, useEffect } from "react";
import "./styles.css";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { useSearchParams } from "react-router-dom"
import { createSearchParams, useNavigate } from 'react-router-dom';
import SocketContext from "../contexts/CreateContext";

let socket;

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    socket.emit("cancel-match");
    console.log("Failure");
    return (
      <div className="timer">
        Please try again later. 
      </div>
    );
  }

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

export default function CountdownPage() {

  function Socket() {
    const socket = useContext(SocketContext);
    return socket;
  }
  socket = Socket();

  // Navigation
  const navigate = useNavigate();

  // Retrieve Difficulty
  const [searchparams] = useSearchParams();
  const difficulty = searchparams.get("difficulty");
  console.log("Received as: " + difficulty)

  useEffect(() => { 
    // Initialize when the page is rendered
    socket.emit("request-match", difficulty);

    socket.on('match-success', (hostPlayer, guestPlayer) => {
      console.log("received");
        if (socket.id === hostPlayer || socket.id === guestPlayer) {
            socket.emit("join-room", hostPlayer);
            console.log("Joining Room");
            navigate({
                pathname: "/room",
                search: createSearchParams({
                  roomID: hostPlayer,
                  difficulty: difficulty
                }).toString()
            })
        }
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected")
    })
    
    return () => {
      socket.off('match-success');
      socket.off('disconnect');
    };
  }, [difficulty, navigate]);

  const returnHome = event => {
    event.preventDefault();
    socket.emit("cancel-match");
    console.log("Left");
    navigate("/difficulty");
  }

  return (
      <div className="App">
          <h1>
              PeerPrep
          </h1>
          <div className="timer-wrapper">
              <CountdownCircleTimer
                  isPlaying
                  size={250}
                  duration={30}
                  colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                  colorsTime={[10, 6, 3, 0]}
                  onComplete={() => ({ shouldRepeat: false, delay: 1 })}
              >
                  {renderTime}
              </CountdownCircleTimer>
          </div>
          <p className="info">
              Please wait while we search for your best peer-mate!
          </p>
          <Box textAlign='center'>
            <Button onClick={returnHome}
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<CancelIcon />}
              >
                Cancel
            </Button>
          </Box>
      </div>
  );
}

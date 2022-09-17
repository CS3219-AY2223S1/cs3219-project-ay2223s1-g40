import React, { useEffect } from "react";
import "./styles.css";

import { io } from "socket.io-client";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useSearchParams } from "react-router-dom"
import {createSearchParams, useNavigate} from 'react-router-dom';

// Prevent eager initialization of socket
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

  // Navigation
  const navigate = useNavigate();

  // Retrieve Difficulty
  const [searchparams] = useSearchParams();
  const difficulty = searchparams.get("difficulty");
  console.log("Received as: " + difficulty)

  useEffect(() => { 
      // Initialize when the page is rendered
      socket = io("http://localhost:8001");
      socket.emit("request-match", difficulty);

      socket.on('match-success', (hostPlayer, guestPlayer) => {
        console.log("received");
          if (socket.id === hostPlayer || socket.id === guestPlayer) {
              socket.emit("join-room", hostPlayer);
              console.log("Joining Room");
              navigate({
                  pathname: "/room",
                  search: createSearchParams({
                    communications: socket,
                    roomID: hostPlayer
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

  return (
      <div className="App">
          <h1>
              PeerPrep
          </h1>
          <div className="timer-wrapper">
              <CountdownCircleTimer
                  isPlaying
                  size={250}
                  duration={10}
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
      </div>
  );
}

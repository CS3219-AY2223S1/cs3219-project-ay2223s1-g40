import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom"
import VideoPlayer from "react-background-video-player";
import { useEffect, useState } from "react";


import "./styles.css";
import backgroundVideo from "./background.mp4"

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">
      Please try again later. </div>;
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

    // Retrieve Difficulty
    const[searchparams] = useSearchParams();
    const difficulty = searchparams.get("difficulty");
    console.log("Received as: " + difficulty)

    // The Client Communication
    const socket = io("http://localhost:8001");
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
        setIsConnected(true);
        });

        socket.on('disconnect', () => {
        setIsConnected(false);
        });

        socket.on('match-success', (hostPlayer, guestPlayer) => {
            if (socket.id === hostPlayer || socket.id === guestPlayer) {
                socket.emit("join-room", hostPlayer);
            }
        })

        return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('match-success');
        };
    }, []);

    socket.emit("request-match", difficulty);

    return (
        <div className="App">
        <VideoPlayer
            className="video"
            src={
                backgroundVideo
            }
            autoPlay={true}
            muted={true}
        />
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
        </div>
    );
    }
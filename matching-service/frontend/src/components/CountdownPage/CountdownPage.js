import React, { useEffect } from "react";
import "./styles.css";

import { io } from "socket.io-client";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useSearchParams } from "react-router-dom"

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
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

    // Retrieve Difficulty
    const [searchparams] = useSearchParams();
    const difficulty = searchparams.get("difficulty");
    console.log("Received as: " + difficulty)

    useEffect(() => {
        const socket = io("http://localhost:8001");
        socket.emit("request-match", difficulty);

        // socket.on('connect', () => {
        //     setIsConnected(true);
        //     socket.emit("request-match", difficulty);
        // });

        // socket.on('disconnect', () => {
        //     setIsConnected(false);
        // });

        socket.on('match-success', (hostPlayer, guestPlayer) => {
            if (socket.id === hostPlayer || socket.id === guestPlayer) {
                socket.emit("join-room", hostPlayer);
            }
        })

        return () => {
        // socket.off('connect');
        // socket.off('disconnect');
        socket.off('match-success');
        };
    }, []);

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
        </div>
    );
}

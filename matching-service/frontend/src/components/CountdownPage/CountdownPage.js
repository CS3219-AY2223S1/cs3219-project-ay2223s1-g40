import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";


import "./styles.css";
//import backgroundVideo from "./media/videos/background.mp4"

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
  return (
    <div className="App">
      {/* <video loop autoPlay muted id='video'>
        <source
          src={backgroundVideo}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video> */}
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
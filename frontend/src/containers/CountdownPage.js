import React, { useContext, useEffect } from "react";
import "./styles.css";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import CancelIcon from "@mui/icons-material/Cancel";
import { Button, Box, Heading } from "@chakra-ui/react";

import { useSearchParams } from "react-router-dom";
import { createSearchParams, useNavigate } from "react-router-dom";
import SocketContext from "../contexts/CreateContext";

import useUserStore from "../store/userStore";

let socket;

const renderTime = ({ remainingTime }) => {
  
  if (remainingTime === 0) {
    socket.emit("cancel-match");
    console.log("Failure");
    return <div className="timer">Please try again later.</div>;
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

  const zustandUserId = useUserStore((state) => state.userId);

  // Navigation
  const navigate = useNavigate();

  // Retrieve Difficulty
  const [searchparams] = useSearchParams();
  const difficulty = searchparams.get("difficulty");
  console.log("Received as: " + difficulty);

  useEffect(() => {
    // Initialize when the page is rendered
    socket.emit("request-match", { userId: zustandUserId, difficulty});

    socket.on("match-success", ({hostSocket, guestSocket}) => {
      console.log("received");
      if (socket.id === hostSocket || socket.id === guestSocket) {
        socket.emit("join-room", hostSocket);
        console.log("Joining Room");
        navigate({
          pathname: "/room",
          search: createSearchParams({
            roomID: hostSocket,
            difficulty: difficulty,
          }).toString(),
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("match-success");
      socket.off("disconnect");
    };
  }, [difficulty, navigate]);

  const returnHome = (event) => {
    event.preventDefault();
    socket.emit("cancel-match");
    console.log("Left");
    navigate("/difficulty");
  };

  return (
    <div className="App">
      <Heading textAlign="center" m={4}>
        {" "}
        Peerprep{" "}
      </Heading>
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
      <Box textAlign="center">
        <Button
          borderWidth="1px"
          variant="solid"
          onClick={returnHome}
          colorScheme="facebook"
          sx={{ mt: 3, mb: 2 }}
          leftIcon={<CancelIcon />}
        >
          Cancel
        </Button>
      </Box>
    </div>
  );
}

import React, { useContext } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useSearchParams, useNavigate } from "react-router-dom";
import SocketContext from "./CreateContext";

export default function RoomPage() {

    function Socket() {
        const socket = useContext(SocketContext);
        return socket
    }
    const socket = Socket();
    
    const navigate = useNavigate();
    const returnHome = event => {
        event.preventDefault()
        socket.emit("leave-room");
        console.log("Left")
        navigate("/difficulty")
    }

    // Retrieve Info
    const [searchparams] = useSearchParams();
    const roomID = searchparams.get("roomID")
    const questionID = searchparams.get("questionID")
    let question = '';
    console.log("Received as: " + roomID)
    console.log("Question ID: " + questionID)

    async function retrieveQuestion(questionID) {
        const response = await fetch('http://localhost:3001/Questions')
        const json = await response.json();
        return json.QuestionData;
    }

    function scrapeQuestion(data, questionID) {
        for (let i = 0; i < data.length; i++) {
            if (data[i]._id === questionID) {
                return data[i].body;
            }
        }
    }

    console.log(retrieveQuestion(questionID).then(
        (data) => {
            return scrapeQuestion(data, questionID);
        }
    ))

    return (
        <Box>
            <h1>
                Room
            </h1>
            <h1>
            </h1>
            <h1>
                Room ID: {roomID}
            </h1>
            <Button onClick={returnHome}
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<KeyboardReturnIcon />}
            >
              Return
            </Button>
        </Box>
    )
}
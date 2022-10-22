import React, { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useSearchParams, useNavigate } from "react-router-dom";
import SocketContext from "../contexts/CreateContext";
import Typography from "@mui/material/Typography";
import { borders } from '@mui/system';

import io from 'socket.io-client';
import "quill/dist/quill.snow.css";
import Quill from "quill";

export default function RoomPage() {
    // Initialization
    function Socket() {
        const socket = useContext(SocketContext);
        return socket;
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
    const roomID = searchparams.get("roomID");
    const difficulty = searchparams.get("difficulty");
    console.log("Received as: " + roomID);

    // Collab Service
    const [collabSocket, setCollabSocket] = useState();
    const [quill, setQuill] = useState();
    useEffect(() => {
        const collabS = io("http://localhost:3001");
        setCollabSocket(collabS);
        collabS.emit("join-room", roomID);

        return () => {
            collabS.disconnect();
        }
    }, []);

    useEffect(() => {
        if (collabSocket == null || quill == null) {
            return;
        }
        const handler = (delta, oldDelta, source) => {
            if (source !== "user") {
                return;
            }
            collabSocket.emit("send-changes", { delta, roomID });
        };
        quill.on("text-change", handler);

        return () => {
            quill.off("text-change", handler);
        }
    }, [collabSocket, quill]);

    useEffect(() => {
        if (collabSocket == null || quill == null) {
            return;
        }
        const handler = (delta) => {
            quill.updateContents(delta);
        };
        collabSocket.on("receive-changes", handler);

        return () => {
            collabSocket.off("receive-changes", handler);
        }
    }, [collabSocket, quill]);

    const wrapperRef = useRef();
    useLayoutEffect(() => {
        const editor = document.createElement("div");
        wrapperRef.current.append(editor);
        const q = new Quill(editor, { theme: "snow"});
        setQuill(q);
        return () => {
            wrapperRef.current.innerHTML = "";
        };
    }, []);

    // Matching Service --> Question Service
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionDescription, setQuestionDescription] = useState("");
    useEffect(() => {
        if (socket.id === roomID) {
            socket.emit("request-question", { difficulty, roomID });
        }
        socket.on("distribute-question", (question) => {
            console.log(question);
            setQuestionTitle(question.existingQuestion.title);
            setQuestionDescription(question.existingQuestion.body);
        })

        return () => {
            socket.off("distribute-question");
        }
    }, []);

    return (
        <Box>
            <Box 
                sx={{
                    height: '25%',
                    margin: 2,
                }}>
                <Button onClick={returnHome}
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    startIcon={<KeyboardReturnIcon />}
                    >
                    Return to Difficulty Page
                </Button>
            </Box>
            <Box
                sx={{
                    margin: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderColor: 'primary.main',
                    borderRadius: '16px'
                }}>
                <Typography component="h1" variant="h5">
                    {questionTitle}
                </Typography>
                <div class="content__u3I1">
                    {questionDescription}
                </div>
            </Box>
                <div class="float-container">
                    <div class="float-collab" id="container" ref = {wrapperRef}></div>
                    <div class="float-chat"> Chat Box </div>
                </div>
            </Box>
    )
}

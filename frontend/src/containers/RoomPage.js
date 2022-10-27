import React, { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSearchParams, useNavigate } from "react-router-dom";
import SocketContext from "../contexts/CreateContext";
import Typography from "@mui/material/Typography";

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

    // Warning when refreshing
    useEffect(() => {
        const unloadCallback = (event) => {
          event.preventDefault();
          event.returnValue = "";
          initialiseCollab();
          return "";
        };
        
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
      }, []);

    // Retrieve Info
    const [searchparams] = useSearchParams();
    const roomID = searchparams.get("roomID");
    const difficulty = searchparams.get("difficulty");
    console.log("Received as: " + roomID);

    // Collab Service
    const [collabSocket, setCollabSocket] = useState();
    const [quill, setQuill] = useState();

    const initialiseCollab = () => {
        const collabS = io("http://localhost:3001");
        setCollabSocket(collabS);
        collabS.emit("join-room", roomID);
    }
    useEffect(() => {
        initialiseCollab();
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
        setQuestionTitle(JSON.parse(window.localStorage.getItem('title')));
        setQuestionDescription(JSON.parse(window.localStorage.getItem('description')));
      }, []);
    useEffect(() => {
        window.localStorage.setItem('title', JSON.stringify(questionTitle));
        window.localStorage.setItem('description', JSON.stringify(questionDescription));
    }, [questionTitle, questionDescription])

    useEffect(() => {
        if (socket.id === roomID) {
            socket.emit("request-question", { difficulty, roomID });
        }
        socket.on("distribute-question", (question) => {
            setQuestionTitle(question.existingQuestion.title);
            setQuestionDescription(question.existingQuestion.body);
        })

        return () => {
            socket.off("distribute-question");
        }
    }, []);

    function createMarkup(questionBody) {
        return {__html: questionBody}
    }
    function formatHtml(questionBody) {
        return <div class="content__u3I1 code"
        dangerouslySetInnerHTML={createMarkup(questionBody)} />;
    }

    // Submit
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const requestSubmit = () => {
        setDialogueOpen(true);
    }
    const handleClose = () => {
        setDialogueOpen(false);
    }
    const handleSubmit = () => {
        socket.emit("leave-room", roomID);
        console.log("Left");
        navigate("/difficulty");
    }
    const handleCloseToast = () => {
        setToastOpen(false);
    }
    useEffect(() => {
        socket.on("notify-leave-room", () => {
            setToastOpen(true);
        })
        return () => {
            socket.off("notify-leave-room");
        }
    }, []);

    return (
        <Box>
            <Box 
                class="submit-button"
                sx={{
                    height: '25%',
                    margin: 2,
                }}>
                <Button onClick={requestSubmit}
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Submit
                </Button>
            </Box>

            <Dialog
                open={dialogueOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you want to submit the session?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Have you and your peer agreed to submit the session? 
                        We advise you to talk to your peer before submitting the session.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Don't submit yet</Button>
                    <Button onClick={handleSubmit} autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

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
                <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
                    {questionTitle}
                </Typography>
                {formatHtml(questionDescription)}
            </Box>

            <div class="float-container">
                <div class="float-collab" id="container" ref = {wrapperRef}></div>
                <div class="float-chat"> Chat Box </div>
            </div>

            <Snackbar 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={toastOpen} 
                autoHideDuration={5000} 
                onClose={handleCloseToast}>
                <Alert severity="info" sx={{ fontSize: 16, width: '100%' }}>
                    Your peer has submitted the session and left the room.
                </Alert>
            </Snackbar>
        </Box>
    )
}

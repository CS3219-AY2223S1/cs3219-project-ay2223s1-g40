import React, { useContext, useEffect, useRef, useState, useLayoutEffect, Fragment} from "react";
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

import { Container, FormControl, getInputAdornmentUtilityClass, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

import io from 'socket.io-client';
import "quill/dist/quill.snow.css";
import Quill from "quill";

// Chat Message Encapsulation
export class ChatMessageDto {
    constructor(user, message){
        this.user = user;
        this.message = message;
    }
}

export default function RoomPage() {
    // Initialisation
    const socketRef = useRef(useContext(SocketContext));
    const socket = socketRef.current;
    const navigate = useNavigate();

    // Warning when refreshing
    useEffect(() => {
        const unloadCallback = (event) => {
          event.preventDefault();
          event.returnValue = "";
          initialiseCollab();
          initialiseChat();
          return "";
        };
        
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
      }, []);

    // Retrieve Info
    const [searchparams] = useSearchParams();
    const roomID = searchparams.get("roomID");
    const difficulty = searchparams.get("difficulty");

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

    // Chat Service
    const [chatSocket, setChatSocket] = useState();
    const scrollBottomRef = useRef(null);
    const welcomeMessage = { user: "Admin", message: "You and your peer have joined the room!"};
    const [chatMessages, setChatMessages] = useState([welcomeMessage]);
    const [message, setMessage] = useState('');
    
    const initialiseChat = () => {
        const chatS = io("http://localhost:3003");
        setChatSocket(chatS);
        chatS.emit("join-room", roomID);
    }
    useEffect(() => {
        initialiseChat();
    }, []);

    useEffect(() => {
        if (!chatSocket) {
            return;
        }
        chatSocket.on('chat-message', message => {
            const chatMessageDto = JSON.parse(message);
            setChatMessages([...chatMessages, {
                user: chatMessageDto.user,                
                message: chatMessageDto.message
            }]);
        });
        return () => {
            chatSocket.off('chat-message', message);
        }
    }, [chatSocket, chatMessages]);
    
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }
    const sendMessage = () => {
        if (message) {
            setChatMessages([...chatMessages, {
                user: "You",
                message: message
            }]);
            chatSocket.emit('send-chat-message', 
                { message: JSON.stringify(new ChatMessageDto("Peer", message)), roomID});
            setMessage('');
        }
    }
    const handleEnterKey = (event) => {
        const ENTER_KEY_CODE = 13
        if(event.keyCode === ENTER_KEY_CODE){
            sendMessage();
        }
    }
    const listChatMessages = chatMessages.map((chatMessageDto, index) => 
        <ListItem key={index}>
            <ListItemText primary={`${chatMessageDto.user}: ${chatMessageDto.message}`}/>
        </ListItem>
    );

    // Matching Service --> Question Service
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionDescription, setQuestionDescription] = useState("");

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
    useEffect(() => {
        setQuestionTitle(JSON.parse(window.localStorage.getItem('title')));
        setQuestionDescription(JSON.parse(window.localStorage.getItem('description')));
      }, []);

    useEffect(() => {
        window.localStorage.setItem('title', JSON.stringify(questionTitle));
        window.localStorage.setItem('description', JSON.stringify(questionDescription));
    }, [questionTitle, questionDescription])

    // Question Display
    function createMarkup(questionBody) {
        return {__html: questionBody}
    }
    function formatHtml(questionBody) {
        return <div class="content__u3I1 code"
        dangerouslySetInnerHTML={createMarkup(questionBody)} />;
    }

    // Submit Button
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const requestSubmit = () => {
        setDialogueOpen(true);
    }
    const handleClose = () => {
        setDialogueOpen(false);
    }
    const handleSubmit = () => {
        chatSocket.emit("notify-leave-room", roomID);
        socket.emit("leave-room", roomID);
        console.log("Left");
        navigate("/difficulty");
    }
    const handleCloseToast = () => {
        setToastOpen(false);
    }

    useEffect(() => {
        if (!chatSocket) {
            return;
        }
        chatSocket.on("notify-leave-room", () => {
            setToastOpen(true);
        })
        return () => {
            chatSocket.off("notify-leave-room");
        }
    }, [chatSocket]);

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
                    sx={{ mt: 3, mb: 2, position: "fixed", top: 0, right: 15, Index: 2000 }}
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
                <div class="float-collab" id="container" ref={wrapperRef}></div>
                <div class="float-chat">
                <Fragment>
                    <Container>
                        <Paper>
                            <Box p={1}>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid id="chat-window" xs={12} item>
                                        <List id="chat-window-messages">
                                            {listChatMessages}
                                            <ListItem ref={scrollBottomRef}></ListItem>
                                        </List>
                                    </Grid>
                                    <Grid xs={9} item>
                                        <FormControl fullWidth>
                                            <TextField onChange={handleMessageChange} onKeyDown={handleEnterKey}
                                                value={message}
                                                label="Type your message..."
                                                variant="outlined" />
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={1} item>
                                        <IconButton onClick={sendMessage}
                                            aria-label="send"
                                            color="primary">
                                            <SendIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Container>
                </Fragment>
                </div>
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

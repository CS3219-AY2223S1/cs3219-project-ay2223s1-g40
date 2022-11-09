import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

import {
  Box,
  Button,
  Container,
  Heading,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  Divider,
  List,
  ListItem,
  Text,
  Grid,
  IconButton,
  Input,
  Flex,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import { FormControl } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useSearchParams, useNavigate } from "react-router-dom";
import SocketContext from "../contexts/CreateContext";
import io from "socket.io-client";
import "quill/dist/quill.snow.css";
import Quill from "quill";

import { URI_COLLAB_SVC, URI_CHAT_SVC } from "../configs";

// Chat Message Encapsulation
export class ChatMessageDto {
  constructor(user, message) {
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
    const collabS = io(URI_COLLAB_SVC);
    setCollabSocket(collabS);
    collabS.emit("join-room", roomID);
  };
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
    };
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
    };
  }, [collabSocket, quill]);

  const wrapperRef = useRef();
  useLayoutEffect(() => {
    const editor = document.createElement("div");
    wrapperRef.current.append(editor);
    const q = new Quill(editor, { theme: "snow" });
    setQuill(q);
    return () => {
      wrapperRef.current.innerHTML = "";
    };
  }, []);

  // Chat Service
  const [chatSocket, setChatSocket] = useState();
  const scrollBottomRef = useRef(null);
  const welcomeMessage = {
    user: "Admin",
    message: "You and your peer have joined the room!",
  };
  const [chatMessages, setChatMessages] = useState([welcomeMessage]);
  const [message, setMessage] = useState("");

  const initialiseChat = () => {
    const chatS = io(URI_CHAT_SVC);
    setChatSocket(chatS);
    chatS.emit("join-room", roomID);
  };
  useEffect(() => {
    initialiseChat();
  }, []);

  useEffect(() => {
    if (!chatSocket) {
      return;
    }
    chatSocket.on("chat-message", (message) => {
      const chatMessageDto = JSON.parse(message);
      setChatMessages([
        ...chatMessages,
        {
          user: chatMessageDto.user,
          message: chatMessageDto.message,
        },
      ]);
    });
    return () => {
      chatSocket.off("chat-message", message);
    };
  }, [chatSocket, chatMessages]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const sendMessage = () => {
    if (message) {
      setChatMessages([
        ...chatMessages,
        {
          user: "You",
          message: message,
        },
      ]);
      chatSocket.emit("send-chat-message", {
        message: JSON.stringify(new ChatMessageDto("Peer", message)),
        roomID,
      });
      setMessage("");
    }
  };
  const handleEnterKey = (event) => {
    const ENTER_KEY_CODE = 13;
    if (event.keyCode === ENTER_KEY_CODE) {
      sendMessage();
    }
  };
  const listChatMessages = chatMessages.map((chatMessageDto, index) => (
    <ListItem key={index}>
      <Text>{`${chatMessageDto.user}: ${chatMessageDto.message}`}</Text>
    </ListItem>
  ));

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
    });

    return () => {
      socket.off("distribute-question");
    };
  }, []);
  useEffect(() => {
    setQuestionTitle(JSON.parse(window.localStorage.getItem("title")));
    setQuestionDescription(
      JSON.parse(window.localStorage.getItem("description"))
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem("title", JSON.stringify(questionTitle));
    window.localStorage.setItem(
      "description",
      JSON.stringify(questionDescription)
    );
  }, [questionTitle, questionDescription]);

  // Question Display
  function createMarkup(questionBody) {
    return { __html: questionBody };
  }
  function formatHtml(questionBody) {
    return (
      <div
        class="content__u3I1 code"
        dangerouslySetInnerHTML={createMarkup(questionBody)}
      />
    );
  }

  // Submit Button
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const toast = useToast();

  const requestSubmit = () => {
    setDialogueOpen(true);
  };
  const handleClose = () => {
    setDialogueOpen(false);
  };
  const handleSubmit = () => {
    chatSocket.emit("notify-leave-room", roomID);
    socket.emit("leave-room", roomID);
    console.log("Left");
    navigate("/difficulty");
  };

  useEffect(() => {
    if (!chatSocket) {
      return;
    }
    chatSocket.on("notify-leave-room", () => {
      toast({
        title: "Your peer has submitted the session and left the room.",
        status: "info",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    });
    return () => {
      chatSocket.off("notify-leave-room");
    };
  }, [chatSocket]);

  const Question = () => {
    return (
      <Box padding={4} minWidth="300px" width="50vw">
        <Heading as="h1" sx={{ marginBottom: 2 }} textAlign="left">
          {questionTitle}
        </Heading>
        {/* <Text> {formatHtml(questionDescription)} </Text> */}
        <Text> {questionDescription} </Text>
      </Box>
    );
  };

  return (
    <Flex direction={"row"} wrap="wrap" flex={1}>
      <Flex
        direction={"column"}
        justifyContent="space-between"
        minWidth="300px"
        flex={1}
        height="100%"
      >
        <Box height="50%" p={6} pb={0}>
          <Question />
        </Box>
        <Divider />

        <Box height="50%" p={6} pt={0}>
          <Flex direction="column" justifyContent="flex-end" height="100%">
            <Flex direction="column" gap="3px" my="5px" overflowY="auto">
              <Box p={1}>
                <Grid alignItems="center">
                  <Grid id="chat-window">
                    <List id="chat-window-messages">
                      {listChatMessages}
                      <ListItem ref={scrollBottomRef}></ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Flex>
            <Grid>
              <FormControl fullWidth>
                <Input
                  onChange={handleMessageChange}
                  onKeyDown={handleEnterKey}
                  value={message}
                  placeholder="Type your message..."
                  variant="outline"
                />
              </FormControl>
            </Grid>
            <Grid>
              <IconButton onClick={sendMessage} aria-label="send" color="blue">
                <SendIcon />
              </IconButton>
            </Grid>
          </Flex>
        </Box>
      </Flex>
      <Divider orientation="vertical" />

      <Flex direction={"column"} padding={2} minWidth="300px" width={"50vw"}>
        <Box border={2} alignContent={"center"} alignItems="center">
          <div class="float-collab" id="container" ref={wrapperRef}></div>
        </Box>
        <Button
          onClick={requestSubmit}
          type="submit"
          colorScheme="blue"
          width={"25%"}
        >
          Submit
        </Button>
      </Flex>
      <AlertDialog isOpen={dialogueOpen} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            Do you want to submit the session?
          </AlertDialogHeader>
          <AlertDialogBody id="alert-dialog-description">
            Have you and your peer agreed to submit the session? We advise you
            to talk to your peer before submitting the session.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={handleClose}>Don't submit yet</Button>
            <Button onClick={handleSubmit} colorScheme="blue" ml={2}>
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}

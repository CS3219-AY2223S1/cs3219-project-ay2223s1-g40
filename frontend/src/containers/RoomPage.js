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

import useUserStore from "../store/userStore";
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
  const zustandUserId = useUserStore((state) => state.userId);

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
      console.log(question);
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
      <Flex direction="column" alignItems="center" minWidth="300px" width="50vw">
        <Heading as="h1" sx={{ marginBottom: 2 }}>
          {questionTitle}
        </Heading>
        <Text> {formatHtml(questionDescription)} </Text>
        {/* <Text> {questionDescription} </Text> */}
      </Flex>
    );
  };

  return (
    <Flex direction="column" alignItems="center" flex={1}>

      <Button
        onClick={requestSubmit}
        type="submit"
        colorScheme="blue"
        width="10%"
        alignSelf="flex-end"
        m={4}
      >
        Submit
      </Button>

      <Box>
        <Question />
      </Box>

      <Divider m={4}/>

      <Flex
        direction="row"
        justifyContent="center"
        flex={1}
      >
        <Flex direction={"column"} padding={2} minWidth="75vw" mr={4}>
            <div class="float-collab" id="container" ref={wrapperRef}></div>
        </Flex>

        <Box>
          <Box height="8.5px"/>
          <Box minwidth="25vw" mr={2}>
            <Flex direction="column" alignContent="center">

              <Flex direction="column" mb={1}>
                  <Grid alignItems="center">
                    <List id="chat-window-messages">
                      {listChatMessages}
                      <ListItem ref={scrollBottomRef}></ListItem>
                    </List>
                  </Grid>
              </Flex>

              <Flex direction="row">
                <Grid width="85%">
                  <FormControl>
                    <Input
                      onChange={handleMessageChange}
                      onKeyDown={handleEnterKey}
                      value={message}
                      placeholder="Type your message..."
                      variant="outline"
                    />
                  </FormControl>
                </Grid>
                <Grid width="15%">
                  <IconButton onClick={sendMessage} aria-label="send">
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Flex>

            </Flex>
          </Box>
        </Box>
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

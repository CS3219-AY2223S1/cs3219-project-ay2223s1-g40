import React, { useContext, useEffect, useState } from "react";

// @mui imports

import {
  Button,
  Text,
  Heading,
  Container,
  Box,
  Link,
  Icon,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";

import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import { createSearchParams, useNavigate } from "react-router-dom";
import SocketContext from "../contexts/CreateContext";

function Copyright(props: any) {
  return (
    <Text textAlign={"center"} {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://www.nus.edu.sg/">
        National University of Singapore
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Text>
  );
}

export default function DifficultyPage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const difficultyPressed = (difficulty: string) => {
    onOpen();
    setDifficulty(difficulty);
  };

  function Socket() {
    const socket = useContext(SocketContext);
    return socket;
  }
  const socket = Socket();

  useEffect(() => {
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      //refreshPage();
    });

    return () => {
      socket.off("disconnect");
    };
  }, [navigate]);

  // Handle Submit Event
  const handleSubmit = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Webpage Render
  return (
    <>
      <Container>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box bgColor="teal" p={2} borderRadius="full">
            <Icon as={StickyNote2RoundedIcon} />
          </Box>
          <Box mt={4} textAlign="center">
            <Heading as="h5" size="xl">
              Welcome to PeerPrep!
            </Heading>
            <Text mt={2} fontSize="lg">
              In order to ensure a customized experience, please choose the
              difficulty of the interview questions you would like to see.
            </Text>
          </Box>
          <Box as="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Stack mt={4} spacing={4}>
              {["Beginner", "Intermediate", "Advanced"].map((value) => {
                return (
                  <Button
                    colorScheme={
                      value.toLowerCase() === "beginner"
                        ? "whatsapp"
                        : value.toLowerCase() === "intermediate"
                        ? "yellow"
                        : "red"
                    }
                    onClick={() => {
                      difficultyPressed(value.toLowerCase());
                      console.log(value);
                      navigate({
                        pathname: "/countdown",
                        search: createSearchParams({
                          difficulty: value.toLowerCase(),
                        }).toString(),
                      });
                    }}
                  >
                    {value}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
}

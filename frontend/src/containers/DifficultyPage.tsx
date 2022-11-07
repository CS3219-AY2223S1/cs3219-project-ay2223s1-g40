import React, { useContext, useEffect, useState } from "react";

// @mui imports

import {
  Button,
  SimpleGrid,
  Avatar,
  Text,
  Heading,
  Container,
  Box,
  Checkbox,
  List,
  ListItem,
  Link,
  Icon,
  ListIcon,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";

import ListItemIcon from "@mui/material/ListItemIcon";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import { createSearchParams, useNavigate } from "react-router-dom";
import SocketContext from "../contexts/CreateContext";
import { GifBoxSharp } from "@mui/icons-material";

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
  const [checked, setChecked] = useState([0]);
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

  // Toggle Difficulty Event
  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked[0]);
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
          <Box bgColor="#9c27b0" p={2} borderRadius="full">
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
          <Copyright sx={{ mt: 8 }} />
          {/* <DifficultyModal
            isOpen={isOpen}
            onClose={onClose}
            difficulty={difficulty}
          /> */}
        </Box>
      </Container>
    </>
  );
}

// TODO: add confirmation modal in selecting difficulty
// const DifficultyModal = ({
//   isOpen,
//   onClose,
//   difficulty,
// }: {
//   isOpen: boolean;
//   difficulty: string;
//   onClose: () => void;
// }): JSX.Element => {
//   return <></>;
// };

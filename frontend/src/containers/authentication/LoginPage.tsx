import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  SimpleGrid,
  Container,
} from "@chakra-ui/react";
import SignInForm from "./form/SignInForm";

const LoginPage = () => {
  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 52 }}
      >
        <Stack direction={{ base: "column", md: "row" }}>
          <Flex p={8} flex={1} align={"center"} justify={"center"}>
            <Box padding={2}>
              <Heading
                lineHeight={1.1}
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              >
                PeerPrep
              </Heading>
              <Text>
                Ace your coding interviews through practice via our interactive
                platform
              </Text>
            </Box>
          </Flex>
        </Stack>
        <Stack>
          <SignInForm />
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;

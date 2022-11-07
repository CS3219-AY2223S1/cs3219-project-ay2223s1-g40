import { Button, Center, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <Center sx={{ height: "100vh" }}>
      <VStack>
        <Heading>Whoops! There's nothing here.</Heading>
        <Text fontSize="3xl">404 Page Not Found</Text>

        <Link
          padding={2}
          rounded={"md"}
          as={NavLink}
          to={"/"}
          _hover={{
            textDecoration: "none",
          }}
        >
          <Button colorScheme="linkedin"> Back To Home</Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default NotFoundPage;

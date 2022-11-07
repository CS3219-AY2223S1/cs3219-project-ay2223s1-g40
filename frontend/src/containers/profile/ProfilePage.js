import {
  Button,
  Center,
  Heading,
  VStack,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import useUserStore from "../../store/userStore";
import UpdatePasswordModal from "./UpdatePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

const ProfilePage = () => {
  const zustandUsername = useUserStore((state) => state.username);
  const zustandLogout = useUserStore((state) => state.logout);
  const {
    isOpen: pwIsOpen,
    onOpen: pwOnOpen,
    onClose: pwOnClose,
  } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  return (
    <Center sx={{ height: "90vh" }}>
      <VStack>
        <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
          <Heading>{zustandUsername}</Heading>
        </Box>
        <Button colorScheme="green" width="100%" onClick={pwOnOpen}>
          Change Password
        </Button>
        <Button colorScheme="teal" width="100%" onClick={() => zustandLogout()}>
          Logout
        </Button>
        <Button colorScheme="red" width="100%" onClick={deleteOnOpen}>
          Delete Account
        </Button>
        <UpdatePasswordModal isOpen={pwIsOpen} onClose={pwOnClose} />
        <DeleteAccountModal isOpen={deleteIsOpen} onClose={deleteOnClose} />
      </VStack>
    </Center>
  );
};

export default ProfilePage;

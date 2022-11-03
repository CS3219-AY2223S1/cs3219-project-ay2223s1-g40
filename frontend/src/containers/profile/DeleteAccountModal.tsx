import {
  Button,
  Modal,
  ModalOverlay,
  FormControl,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  useToast,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import useUserStore from "../../store/userStore";
import { clientUserService } from "../../util/request";
const DeleteAccountModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [confirmationInput, setConfirmationInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isInputTouched = useRef<boolean>(false);
  const toast = useToast();
  const zustandUsername = useUserStore((state) => state.username);
  const zustandLogout = useUserStore((state) => state.logout);

  const onSubmitHandler = async () => {
    setIsSubmitting(true);
    try {
      const response = await clientUserService.post("/delete", {
        username: zustandUsername,
      });
      const { message } = response.data;
      toast({
        title: message,
      });
      setConfirmationInput("");
      zustandLogout();
    } catch (err: any) {
      const message = err?.response?.data?.message;
      toast({
        title: message ?? "Something went wrong",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            Are you sure you want to delete your account? This action is
            irreversible.
            <FormControl
              isInvalid={
                confirmationInput !== zustandUsername && isInputTouched.current
              }
            >
              <FormHelperText marginY={2}>
                Please enter <strong>{zustandUsername}</strong> to delete your
                account.
              </FormHelperText>
              <Input
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={zustandUsername}
                isDisabled={isSubmitting}
                onBlur={() => {
                  isInputTouched.current = true;
                }}
              />
              <FormErrorMessage>Input does not match</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              marginRight={2}
              colorScheme="red"
              isLoading={isSubmitting}
              isDisabled={confirmationInput !== zustandUsername}
              onClick={() => onSubmitHandler()}
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteAccountModal;

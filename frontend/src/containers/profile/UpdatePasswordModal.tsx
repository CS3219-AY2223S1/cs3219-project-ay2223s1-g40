import {
  Button,
  Modal,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

import { useState } from "react";

import { FieldErrorsImpl, useForm } from "react-hook-form";
import useUserStore from "../../store/userStore";

import { clientUserService } from "../../util/request";

const MIN_LENGTH = 1;
const MAX_LENGTH = 64;

const UpdatePasswordModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();
  const [password, setPassword] = useState("");
  const zustandUsername = useUserStore((state) => state.username);
  const jwtToken = useUserStore((state) => state.token);

  type FormValues = {
    username: string;
    oldPassword: string;
    password: string;
    passwordAgain: string;
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: zustandUsername,
      oldPassword: "",
      password: "",
      passwordAgain: "",
    },
  });

  const onSubmitHandler = async (values: FormValues) => {
    try {
      const response = await clientUserService.post(
        "/password",
        values,
        jwtToken
      );
      const { message } = response.data;
      toast({
        title: message,
      });
      reset();
    } catch (err: any) {
      const message = err?.response?.data?.message;
      toast({
        title: message ?? "Something went wrong",
        status: "error",
        isClosable: true,
      });
    }
  };

  const isInvalid = (field: string) => {
    if (
      errors[
        field as keyof FieldErrorsImpl<{
          oldPassword: string;
          password: string;
          passwordAgain: string;
        }>
      ]
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <FormControl isRequired isInvalid={isInvalid("oldPassword")}>
                <FormLabel marginY={2}>Old Password</FormLabel>
                <Input
                  id="changePwOldPw"
                  type="password"
                  placeholder="Old Password"
                  {...register("oldPassword", {
                    minLength: {
                      value: MIN_LENGTH,
                      message: `Password must be at least ${MIN_LENGTH} character`,
                    },
                    maxLength: {
                      value: MAX_LENGTH,
                      message: `Password must be at most ${MAX_LENGTH} characters`,
                    },
                  })}
                />
                {errors.oldPassword && (
                  <FormErrorMessage>
                    {errors.oldPassword.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={isInvalid("password")}>
                <FormLabel marginY={2}>Password</FormLabel>
                <Input
                  id="changePwPw"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    onChange: (e) => setPassword(e.target.value),
                    minLength: {
                      value: MIN_LENGTH,
                      message: `Password must be at least ${MIN_LENGTH} character`,
                    },
                    maxLength: {
                      value: MAX_LENGTH,
                      message: `Password must be at most ${MAX_LENGTH} characters`,
                    },
                  })}
                />
                {errors.password && (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={isInvalid("passwordAgain")}>
                <FormLabel marginY={2}>Password Again</FormLabel>
                <Input
                  id="changePwPwAgain"
                  type="password"
                  placeholder="Password Again"
                  {...register("passwordAgain", {
                    minLength: {
                      value: MIN_LENGTH,
                      message: `Password must be at least ${MIN_LENGTH} character`,
                    },
                    maxLength: {
                      value: MAX_LENGTH,
                      message: `Password must be at most ${MAX_LENGTH} characters`,
                    },
                    validate: (value) =>
                      value == password || "Passwords do not match",
                  })}
                />
                {errors.passwordAgain && (
                  <FormErrorMessage>
                    {errors.passwordAgain.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              marginRight={2}
              colorScheme="facebook"
              isLoading={isSubmitting}
              onClick={handleSubmit(onSubmitHandler)}
            >
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatePasswordModal;

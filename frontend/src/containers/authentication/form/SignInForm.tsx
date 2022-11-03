import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  useToast,
  Stack,
  Text,
  Link,
  Heading,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { IoArrowForwardOutline } from "react-icons/io5";

import { FieldErrorsImpl, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import useUserStore from "../../../store/userStore";
import { clientUserService } from "../../../util/request";
import { useState } from "react";

const MIN_LENGTH = 1;
const MAX_LENGTH = 64;

function SignInForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const zustandLogin = useUserStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  type FormValues = {
    username: string;
    password: string;
  };

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isSubmitting, errors } = formState;

  const onSubmitHandler = async (values: FormValues) => {
    try {
      const response = await clientUserService.post("/login", values);
      const { userId, username } = response.data;
      toast({
        title: "Successfully logged in",
        status: "success",
        isClosable: true,
      });
      zustandLogin(userId, username);
      navigate("/difficulty", { replace: true });
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
        field as keyof FieldErrorsImpl<{ username: string; password: string }>
      ]
    ) {
      return true;
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Stack spacing={4} w={"full"} maxW={"md"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Hello Again!
          </Heading>
          <Text fontSize={"lg"}>
            Please enter your details to sign in to your account
          </Text>
        </Stack>
        <FormControl isRequired isInvalid={isInvalid("username")}>
          <FormLabel> Username </FormLabel>
          <Input
            id="username"
            placeholder="Username"
            {...register("username", {
              minLength: {
                value: MIN_LENGTH,
                message: `Username must be at least ${MIN_LENGTH} characters`,
              },
              maxLength: {
                value: MAX_LENGTH,
                message: `Username must be at most ${MAX_LENGTH} characters`,
              },
            })}
          />
          {errors.username && (
            <FormErrorMessage>{errors.username.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isInvalid("password")}>
          <FormLabel> Password </FormLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                minLength: {
                  value: MIN_LENGTH,
                  message: `Password must be at least ${MIN_LENGTH} characters`,
                },
                maxLength: {
                  value: MAX_LENGTH,
                  message: `Password must be at most ${MAX_LENGTH} characters`,
                },
              })}
            />
            <InputRightElement h={"full"}>
              <Button
                variant={"ghost"}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>

          {errors.password && (
            <FormErrorMessage> {errors.password.message}</FormErrorMessage>
          )}
        </FormControl>
        <Stack spacing={6}>
          <Button
            type="submit"
            marginY={4}
            colorScheme="facebook"
            isLoading={isSubmitting}
            rightIcon={<IoArrowForwardOutline />}
          >
            Submit
          </Button>
        </Stack>

        <Stack pt={6}>
          <Text align={"center"}>
            Don't have an account yet?
            <Link pl={2} color={"blue.400"} href="/signup">
              Sign Up
            </Link>
          </Text>
        </Stack>
      </Stack>
    </form>
  );
}

export default SignInForm;

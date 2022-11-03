import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Stack,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  Link,
  useToast,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { IoArrowForwardOutline } from "react-icons/io5";
import { FieldErrorsImpl, useForm } from "react-hook-form";

import { useState } from "react";
import { clientUserService } from "../../../util/request";
import { useNavigate } from "react-router-dom";

const MIN_LENGTH = 1;
const MAX_LENGTH = 64;
function SignUpForm() {
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAgainPassword, setShowAgainPassword] = useState(false);
  type FormValues = {
    username: string;
    email: string;
    password: string;
    passwordAgain: string;
  };

  const { reset, register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
      passwordAgain: "",
    },
  });
  const { isSubmitting, errors } = formState;
  const navigate = useNavigate();
  const onSubmitHandler = async (values: FormValues) => {
    try {
      const response = await clientUserService.post("", values);
      const { message } = response.data;
      toast({
        title: message + " Please login to continue.",
        duration: 3000,
      });
      //navigate to login screen after 1s
      await new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        navigate("/login")
      );

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
          username: string;
          email: string;
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
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Stack spacing={4} w={"full"} maxW={"md"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"}>Create your account here</Text>
        </Stack>
        <FormControl isRequired isInvalid={isInvalid("username")}>
          <FormLabel>Username</FormLabel>
          <Input
            id="signupUsername"
            placeholder="Username"
            {...register("username", {
              minLength: {
                value: MIN_LENGTH,
                message: `Username must be at least ${MIN_LENGTH} character`,
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
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              id="signupPassword"
              type={showPassword ? "text" : "password"}
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
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={isInvalid("passwordAgain")}>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              id="signupRepeatPassword"
              type={showAgainPassword ? "text" : "password"}
              placeholder="Repeat password"
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
                  value === password || "Passwords do not match",
              })}
            />
            <InputRightElement>
              <Button
                variant={"ghost"}
                onClick={() =>
                  setShowAgainPassword(
                    (showAgainPassword) => !showAgainPassword
                  )
                }
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>

          {errors.passwordAgain && (
            <FormErrorMessage>{errors.passwordAgain.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          type="submit"
          marginY={4}
          colorScheme="facebook"
          isLoading={isSubmitting}
          rightIcon={<IoArrowForwardOutline />}
        >
          Submit
        </Button>
        <Stack pt={6}>
          <Text align={"center"}>
            Already a user?{" "}
            <Link color={"blue.400"} href="/login">
              Login
            </Link>
          </Text>
        </Stack>
      </Stack>
    </form>
  );
}

export default SignUpForm;

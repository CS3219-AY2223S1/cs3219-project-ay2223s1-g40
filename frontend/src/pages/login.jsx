import { useRouter } from "next/router";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import { ButtonLink } from "../components/buttons/tailwind/Button";
import { URL_USER_LOGIN } from "../configs";
import { STATUS_CODE_SUCCESS, STATUS_CODE_BAD_REQUEST } from "../constants";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import LoginForm from "../containers/auth/LoginForm";
import EvenSplit from "../components/layout/EvenSplit";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  function resetErrorMessage() {
    setErrorMessage("");
  }

  const handleLogin = async () => {
    const res = await axios
      .post(URL_USER_LOGIN, { username, password })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_BAD_REQUEST) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Server Error");
        }
      });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      // setAuth({
      //   username,
      //   accessToken: res.data.data.accessToken,
      //   isLoggedIn: true,
      // });

      setUsername("");
      setPassword("");
      router.push("/home");
    }
  };

  // useEffect(() => {
  //   console.log(auth);
  // }, [auth]);

  return (
    <div className="flex justify-center align-middle w-full gap-8">
      <div className="flex justify-center items-center w-full px-2">
        <LoginForm />
      </div>
    </div>
  );
}

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC_LOGIN, URL_USER_SVC_RESETPASSWORD } from "../configs";
import {
  STATUS_CODE_LOGIN,
  STATUS_CODE_INVALID_USER,
  STATUS_CODE_INCORRECT_PASSWORD,
  STATUS_CODE_MISSING_FIELD,
  STATUS_DATABASE_FAILURE,
} from "../constants";
import { Link, Navigate, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavBar";
import { jwtDecode } from "../util/auth";

function LoginPage() {
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetUsername, setResetUsername] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [resetPasswordFailed, setResetPasswordFailed] = useState(null);
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");
  const [cookies, setCookie] = useCookies(["access_token"]);

  /** Reset Password Logic */
  const handleDialog = () => {
    console.log(isEmailValid);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsEmailValid(null);
    setIsDialogOpen(false);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setResetPasswordFailed(false);
    const username = resetUsername;
    const newPassword = resetPassword;
    const email = resetEmail;
    const res = await axios
      .put(URL_USER_SVC_RESETPASSWORD, { username, newPassword, email })
      .catch((err) => {
        if (err.response.status === 400 || err.response.status === 500) {
          setResetPasswordFailed(true);
          setResetPasswordMessage(err.response.data.message);
        }
      });

    if (res && res.status === 200) {
      setResetPasswordFailed(false);
      setResetPasswordMessage(res.data.message);
    }
  };

  /** Login Logic */
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoggedIn(false);

    const res = await axios
      .post(
        URL_USER_SVC_LOGIN,
        { username, password },
        { withCredentials: true }
      )
      .catch((err) => {
        if (
          err.response.status === STATUS_CODE_INCORRECT_PASSWORD ||
          err.response.status === STATUS_CODE_INVALID_USER ||
          err.response.status === STATUS_CODE_MISSING_FIELD ||
          err.response.status === STATUS_DATABASE_FAILURE
        ) {
          setIsLoggedIn(false);
          setLoginMessage(err.response.data.message);
        }
      });

    if (res && res.status === STATUS_CODE_LOGIN) {
      setIsLoggedIn(true);
      console.log(res);
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      setCookie("access_token", accessToken, {
        path: "/",
        expires: new Date(jwtDecode(accessToken).exp * 1000),
      });
      setCookie("refresh_token", refreshToken, {
        path: "/",
        expires: new Date(jwtDecode(refreshToken).exp * 1000),
      });
      navigate("/difficulty");
    }
  };

  return cookies["refresh_token"] ? (
    <Navigate to="/difficulty" />
  ) : (
    <>
      <NavigationBar isAuthenticated={false} />
      <div className="shadow-xl h-full w-1/2 mx-auto my-8 bg-white z-5 rounded-lg">
        <div className="flex flex-col justify-center items-center py-8 ">
          <Typography variant={"h5"} marginBottom={"2rem"}>
            Welcome to PeerPrep
          </Typography>
          <Typography variant={"h7"} marginBottom={"2rem"}>
            Log in with username & password
          </Typography>
          <TextField
            className="w-[40%]"
            label="Username"
            variant="outlined"
            color="secondary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            autoFocus
          />
          <TextField
            className="w-[40%]"
            label="Password"
            variant="outlined"
            color="secondary"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "2rem" }}
          />

          <Button
            className="w-[40%] bg-red-500"
            variant={"contained"}
            color="primary"
            sx={{ marginBottom: "1rem" }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <div style={{ marginBottom: "5px" }}>
            Do not have an account? Sign up{" "}
            <Link className="text-blue-500 hover:text-blue-800" to="/signup">
              here!
            </Link>
          </div>

          <div>
            Forget your password? Reset it{" "}
            <Link
              className="text-blue-500 hover:text-blue-800"
              onClick={handleDialog}
              to=""
            >
              here!
            </Link>
          </div>

          <div>
            {isLoggedIn ? (
              <div> Login success! </div>
            ) : (
              <div style={{ color: "red" }}>{loginMessage}</div>
            )}
          </div>

          <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
            fullWidth
            maxWidth={"xs"}
          >
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                label="Username"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ marginBottom: "1rem" }}
              />
              <TextField
                autoFocus
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ marginBottom: "1rem" }}
              />
              <TextField
                autoFocus
                label="New Password"
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ marginBottom: "2rem" }}
              />
              <div>
                {resetPasswordFailed ? (
                  <div style={{ color: "red" }}> {resetPasswordMessage} </div>
                ) : resetPasswordFailed === false ? (
                  <div style={{ color: "blue" }}>{resetPasswordMessage}</div>
                ) : (
                  <div></div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>Cancel</Button>
              {/* Click on "Reset Password" triggers sending of email and success message as well */}
              <Button onClick={handleResetPassword}>Reset Password</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

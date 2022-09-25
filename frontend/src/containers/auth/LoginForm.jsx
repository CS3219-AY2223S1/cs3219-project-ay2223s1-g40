import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../../constants";
import {
  Card,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { URL_USER_LOGIN } from "../../configs";
import EvenSplit from "../../components/layout/EvenSplit";

export default function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoginSuccess(false);
    const res = await axios
      .post(URL_USER_LOGIN, { username, password })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorDialog(err.response.data);
        } else {
          setErrorDialog(err.response.data);
        }
      });
    if (res && res.status === STATUS_CODE_CREATED) {
      setToken(res.data.userJWT);
      setIsLoginSuccess(true);
      router.push("/home", { state: { token: token, username: username } });
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Typography variant={"h4"} marginBottom={"1rem"} fontWeight="bold">
            Log In
          </Typography>
        </Grid>

        <TextField
          label="Username"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: "1rem" }}
          autoFocus
          fullWidth
        />
        <TextField
          label="Password"
          variant="standard"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: "1rem" }}
          fullWidth
        />

        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          onClick={handleLogin}
        >
          Sign in
        </Button>

        <Typography>
          <Link href="#">Forgot password ?</Link>
        </Typography>
        <Typography>
          {" "}
          Do you have an account ?<Link href="#">Sign Up</Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

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
  Container,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC_CREATEUSER } from "../configs";
import { STATUS_CODE_INVALID_SIGNUP, STATUS_CODE_CREATED } from "../constants";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavBar";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const handleSignup = async () => {
    setIsSignupSuccess(false);
    const res = await axios
      .post(URL_USER_SVC_CREATEUSER, { username, password, email })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_INVALID_SIGNUP) {
          setErrorDialog(err.response.data.message);
        }
      });

    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog(res.data.message);
      setIsSignupSuccess(true);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Success");
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  return (
    <div>
      <NavigationBar isAuthenticated={false} />
      <div className="shadow-xl h-full w-1/2 mx-auto my-8 bg-white z-5 rounded-lg">
        <div className="flex flex-col justify-center items-center py-8 ">
          <Typography variant={"h5"} marginBottom={"1rem"}>
            Create your account
          </Typography>

          <Typography marginBottom={"2rem"}>
            Please fill in all your details to continue
          </Typography>
          <TextField
            className="w-[40%]"
            label="Email"
            variant="outlined"
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            autoFocus
          />
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
            className="w-[40%]"
            sx={{ marginBottom: "1rem" }}
            variant={"contained"}
            color="primary"
            onClick={handleSignup}
          >
            Register
          </Button>

          <div>
            Already have an account? Log in{" "}
            <Link className="text-blue-500 hover:text-blue-800" to="/login">
              here!{" "}
            </Link>
          </div>

          <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>{dialogMsg}</DialogContentText>
            </DialogContent>
            <DialogActions>
              {isSignupSuccess ? (
                <Button component={Link} to="/login">
                  Log in
                </Button>
              ) : (
                <Button onClick={closeDialog}>Done</Button>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

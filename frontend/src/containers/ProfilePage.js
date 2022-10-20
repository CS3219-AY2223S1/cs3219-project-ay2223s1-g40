import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  IconButton,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { URL_USER_LOGOUT, URL_USER_SVC } from "../configs";
import { useCookies } from "react-cookie";
import { URL_USER_SVC_LOGOUT } from "../configs";
import NavigationBar from "../components/NavBar";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "../util/auth";

const ProfilePage = () => {
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteAccount, setDeleteAccount] = useState(false);

  const handleChangePassword = () => {
    setAnchorEl(null);
    setChangePassword(true);
  };

  const handleDeleteAccount = () => {
    setAnchorEl(null);
    setDeleteAccount(true);
  };

  const handleCloseChangePassword = () => {
    setChangePassword(false);
    setNewPassword("");
  };

  const handleCloseDeleteAccount = () => {
    setDeleteAccount(false);
  };

  const handleChangePasswordOnClick = () => {
    setAnchorEl(null);
    // Triggers change password!
  };

  const handleDeleteAccountOnClick = () => {
    setAnchorEl(null);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isConfirm, setIsConfirm] = useState("");
  const [cookies, , removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [logOut, setLogOut] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
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
  const handleLogout = async () => {
    const refresh_token = cookies["refresh_token"];
    axios
      .post(
        URL_USER_SVC_LOGOUT,
        { username: jwtDecode(refresh_token).username },
        {
          headers: {
            Authorization: "Bearer " + refresh_token,
          },
        }
      )
      .then((x) => {
        navigate("/login");
      });
    removeCookie("access_token");
    removeCookie("refresh_token");
    setAnchorEl(null);
    setLogOut(true);
  };

  // const handleUpdate = async () => {
  //   const res = await axios
  //     .put(
  //       URL_USER_SVC,
  //       { oldPassword, newPassword },
  //       { withCredentials: true, credentials: "include" }
  //     )
  //     .catch((err) => {
  //       if (err.response.status !== STATUS_CODE_SUCCESS) {
  //         setErrorDialog("Error while changing password");
  //       }
  //     });
  //   if (res && res.status === STATUS_CODE_SUCCESS) {
  //     setSuccessDialog("Password successfully changed");
  //   }
  // };

  // const handleDeleteAccount = async () => {
  //   const res = await axios
  //     .delete(URL_USER_SVC, { withCredentials: true, credentials: "include" })
  //     .catch((err) => {
  //       if (err.response.status !== STATUS_CODE_SUCCESS) {
  //         console.log("Error while deleting user account");
  //       }
  //     });
  //   if (res && res.status === STATUS_CODE_SUCCESS) {
  //     console.log("User successfully deleted");
  //     setUser(null);
  //     router.push("/");
  //   }
  // };

  // const confirmDelete = () => {
  //   setIsConfirm(true);
  //   setIsDialogOpen(true);
  // };

  // const closeDelete = () => {
  //   setIsConfirm(false);
  //   setIsDialogOpen(false);
  // };
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <NavigationBar isAuthenticated={true} />

      <Box display={"flex"} flexDirection={"column"} width={"90%"}>
        <Box>
          <Typography
            variant={"h4"}
            align="center"
            marginBottom={"2rem"}
            marginTop={"2rem"}
          >
            Account Settings
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          marginBottom={"1rem"}
        >
          {/* Change Password Modal */}
          <Modal
            open={changePassword}
            onClose={handleCloseChangePassword}
            aria-labelledby="modal-modal-title"
          >
            <Box sx={modalStyle}>
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Change Password
                </Typography>
                <IconButton onClick={handleCloseChangePassword}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <TextField
                id="outlined-password-input"
                label="Old Password"
                type="password"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                sx={{ marginTop: "1rem", marginBottom: "1rem" }}
                autoFocus
              />
              <TextField
                id="outlined-password-input"
                label="New Password"
                type="password"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ marginTop: "1rem", marginBottom: "1rem" }}
                autoFocus
              />
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flexStart"}
                style={{ paddingTop: "5%" }}
              >
                <Button
                  variant={"contained"}
                  onClick={handleChangePasswordOnClick}
                >
                  Confirm New Password
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* Delete Account Modal */}
          <Modal
            open={deleteAccount}
            onClose={handleCloseDeleteAccount}
            aria-labelledby="modal-modal-title"
          >
            <Box sx={modalStyle}>
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Delete Account
                </Typography>
                <IconButton onClick={handleCloseDeleteAccount}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                This action is permanent and cannot be undone. If you're sure
                that you want to delete your account, please press "Confirm".
              </Typography>
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flexStart"}
                style={{ paddingTop: "5%" }}
              >
                <Button
                  variant={"contained"}
                  onClick={handleDeleteAccountOnClick}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Modal>
          <div className="flex flex-col gap-4 w-1/2">
            <Button onClick={handleChangePassword} variant={"outlined"}>
              Change Password
            </Button>
            <Button onClick={handleDeleteAccount} variant={"outlined"}>
              Delete Account
            </Button>
            <Button onClick={handleLogout} variant={"outlined"}>
              Logout
            </Button>
          </div>
        </Box>

        {/* <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
        <Button
          variant={"outlined"}
          sx={{ width: 1 / 2 }}
          onClick={confirmDelete}
        >
          Delete account
        </Button>
      </Box>
      {isConfirm ? (
        <Dialog open={isDialogOpen}>
          {" "}
          <DialogTitle> Confirm Delete Account?</DialogTitle>
          <Button onClick={handleDeleteAccount}>Yes</Button>
          <Button onClick={closeDelete} open={false}>
            No
          </Button>
        </Dialog>
      ) : (
        <></>
      )}
   */}
        {/* <div className="mx-auto w-[50%]">
        <Typography
          className="bg-blue-50"
          variant={"h6"}
          align="center"
          marginBottom={"1rem"}
        >
          Change Password
        </Typography>
      </div> */}

        {/* <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
        <TextField
          className="w-[50%]"
          label="Old Password"
          variant="standard"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          sx={{ marginBottom: "2rem" }}
          autoFocus
        />
      </Box>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
        <TextField
          className="w-[50%]"
          label="New Password"
          variant="standard"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ marginBottom: "2rem" }}
        />
      </Box>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
        <Button
          variant={"outlined"}
          sx={{ width: 1 / 2 }}
          onClick={handleUpdate}
        >
          Update password
        </Button>
      </Box>
    */}
      </Box>
    </>
  );
};

export default ProfilePage;

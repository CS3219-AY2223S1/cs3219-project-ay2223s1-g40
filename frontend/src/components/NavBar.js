import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Modal,
  TextField,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { jwtDecode } from "../util/auth";
import { URL_USER_SVC_LOGOUT } from "../configs";
import { useNavigate } from "react-router-dom";

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

function NavigationBar({ isAuthenticated }) {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [logOut, setLogOut] = useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfilePage = () => {
    navigate("/profile");
  };
  const handleLogOutOnClick = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
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

  const handleCloseLogOut = () => {
    setLogOut(false);
  };

  return (
    <AppBar style={{ margin: 0 }} position="static">
      {isAuthenticated && (
        <Box display={"flex"} flexDirection={"row"} sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* <div style={{ margin: "1%" }}>
              Welcome, {jwtDecode(cookies["refresh_token"]).username}!
            </div> */}
            <a href="/difficulty" className="flex items-center">
              {" "}
              PeerPrep{" "}
            </a>
          </Typography>
          <Toolbar>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleProfilePage}>Profile</MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Menu>

              {/* Log Out Modal */}
              <Modal open={logOut} aria-labelledby="modal-modal-title">
                <Box sx={modalStyle}>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                  >
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Log Out
                    </Typography>
                    <IconButton onClick={handleCloseLogOut}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Do you wish to end your session?
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"flexStart"}
                    style={{ paddingTop: "5%" }}
                  >
                    <Button
                      variant={"contained"}
                      href="/login"
                      onClick={handleLogOutOnClick}
                    >
                      Back to Login Page
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </div>
          </Toolbar>
        </Box>
      )}
    </AppBar>
  );
}

export default NavigationBar;

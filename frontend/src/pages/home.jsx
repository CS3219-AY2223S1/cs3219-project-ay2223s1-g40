import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // const cookies = new Cookies();
  // axios.defaults.withCredentials = true;
  return (
    <Box display={"flex"} flexDirection={"column"} width={"90%"}>
      <Box>
        <Typography variant={"h4"} align="center" marginBottom={"2rem"}>
          Account Settings
        </Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"center"}
        marginBottom={"1rem"}
      >
        <Button variant={"outlined"} sx={{ width: 1 / 2 }}>
          Logout
        </Button>
      </Box>

      <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
        <Button variant={"outlined"} sx={{ width: 1 / 2 }}>
          Delete account
        </Button>
      </Box>
      <br />
      <br />
      <div className="mx-auto w-[50%]">
        <Typography
          className="bg-blue-50"
          variant={"h6"}
          align="center"
          marginBottom={"1rem"}
        >
          Change Password
        </Typography>
      </div>

      <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
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
        <Button variant={"outlined"} sx={{ width: 1 / 2 }}>
          Update password
        </Button>
      </Box>
    </Box>
  );
};

export default Home;

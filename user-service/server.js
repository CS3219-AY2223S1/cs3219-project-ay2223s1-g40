import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
  credentials: true,
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // config cors so that front-end can use

app.get("/", (req, res) => res.send("Hello World from user-service"));

import {
  createUser,
  loginUser,
  deleteUser,
  updatePassword,
  resetPassword,
} from "./controller/user-controller.js";
import {
  validateAccessToken,
  renewAccessAndRefreshTokens,
  invalidateRefreshToken,
} from "./controller/user-token-handler.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"));
router.post("/createuser", createUser);
router.post("/login", loginUser);
router.post("/validateaccesstoken", validateAccessToken);
router.post("/renewtokens", renewAccessAndRefreshTokens);
router.post("/logout", invalidateRefreshToken);
router.delete("/delete", deleteUser);
router.put("/updatepassword", updatePassword);
router.put("/resetpassword", resetPassword);

app.use("/api/user", router);

app.listen(process.env.PORT, () => console.log("user-service listening on port 8000"));

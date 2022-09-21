import { generateToken } from "../auth/index.js";
import {
  ormCreateUser as _createUser,
  ormDoesUserExist as _doesUserExist,
  ormGetUser as _getUser,
} from "../model/user-orm.js";
import { ormCheckUser as _checkUserbyUsername } from "../model/user-orm.js";
import bcrypt from "bcryptjs";

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing" });
    }

    const checkExist = await _doesUserExist(username);
    if (checkExist) {
      console.log("The username already exists!");
      return res
        .status(409)
        .json({ message: "The username is already taken." });
    }
    const resp = await _createUser(username, password);

    if (resp.err) {
      console.log(resp.err);
      return res.status(400).json({ message: "Could not create a new user!" });
    } else {
      console.log(`Created new user ${username} successfully!`);
      return res
        .status(201)
        .json({ message: `Created new user ${username} successfully!` });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}

// Returns a JWT access token upon successful sign in
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing" });
    }

    const checkExist = await _doesUserExist(username);
    if (!checkExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const user = await _getUser(username);
    const jwtToken = generateToken(user);
    //const refreshToken = generateRefreshToken(user);

    // abstract validation of password
    if (bcrypt.hashSync(password, 10) === user.password) {
      return res.status(200).json({
        message: "Login successful",
        data: {
          username: user.username,
          accessToken: jwtToken,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Login failed" });
  }
}

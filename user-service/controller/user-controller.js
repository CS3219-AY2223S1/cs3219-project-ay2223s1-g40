import { generateToken } from "../auth/index.js";
import {
  ormCreateUser as _createUser,
  ormDoesUserExist as _doesUserExist,
  ormGetUser as _getUser,
  ormLoginUser as _loginUser,
  ormLogoutUser as _logoutUser,
} from "../model/user-orm.js";
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
      console.log(
        `The username ${username} already exists! Please use a different username.`
      );
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
    if (username && password) {
      const response = await _loginUser(username, password);

      if (!response) {
        console.log("Incorrect username or password. Please try again!");
        return res.status(400).json({
          message: "Incorrect username or password. Please try again!",
        });
      }

      if (response.err) {
        console.log(`Unable to retrieve user: ${username}`);
        return res
          .status(400)
          .json({ message: `Unable to retrieve user: ${username}` });
      }
      console.log(`User ${username} logged in successfully!`);
      req.session.token = response;
      return res.status(201).json({
        message: "Login successful!",
        token: response,
        session: req.session,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Login failed, authentication failed" });
  }
}

export async function logout(req, res) {
  try {
    const { username } = req.body;
    if (username) {
      const response = await _logoutUser(username, req.session.token);
      if (!response) {
        console.log("User does not exist!");
        return res.status(400).json({ message: "User does not exist!" });
      }
      if (response.err) {
        console.log(`Unable to retrieve user: ${username}`);
        return res
          .status(400)
          .json({ message: `Unable to retrieve user: ${username}` });
      }
      console.log(`User ${username} logged out successfully!`);
      return res.status(201).json({ message: "Logout successful!" });
    } else {
      return res.status(400).json({ message: "Username is missing!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured when logging out" });
  }
}

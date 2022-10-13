import { ormCreateUser as _createUser } from "../model/user-orm.js";
import { ormGetUser as _getUser } from "../model/user-orm.js";
import { ormDeleteUser as _deleteUser } from "../model/user-orm.js";
import { ormUpdatePassword as _updatePassword } from "../model/user-orm.js";
import {
  generateRefreshToken,
  generateAccessToken,
} from "./user-token-handler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtAccessSecretKey = process.env.JWT_ACCESS_SECRET;

// regex check for email to ensure it is in the correct format
const emailRegex = RegExp("\\S+@\\S+\\.\\S+");

const ACCESS_TOKEN_EXPIRE_TIME = 900000;
const REFRESH_TOKEN_EXPIRE_TIME = 1200000;

function verifyAuthHeaderFormat(authHeaderSplit) {
  if (authHeaderSplit.length != 2) {
    throw "Error, HTTP Authorization header has less than 2 elements";
  }
  if (authHeaderSplit[0] != "Bearer") {
    throw "Error, HTTP Authorization header does not have the 'Bearer' type";
  }
  return true;
}

export function getJWTTokenFromAuthHeader(authHeader) {
  const authHeaderSplit = authHeader.split(" ");
  const authHeaderVerified = verifyAuthHeaderFormat(authHeaderSplit);
  if (!authHeaderVerified) {
    throw "Error, HTTP Authorization header format incorrect";
  }
  return authHeaderSplit[1];
}

export async function createUser(req, res) {
  try {
    const { username, password, email } = req.body;
    if (username && password && email) {
      // guard check for email
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message:
            "Could not create a new user, email format invalid. Email has to contain the @ and . character",
          success: false,
        });
      }

      const checkUser = await _getUser(username);
      // user exists
      if (checkUser !== null) {
        return res.status(400).json({
          message: "Could not create a new user, already exists!",
          success: false,
        });
      }
      const resp = await _createUser(username, password, email);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: "Unable to create a new user!", success: false });
      } else {
        return res.status(201).json({
          username: username,
          message: `New user ${username} created successfully!`,
          success: true,
        });
      }
    } else {
      return res.status(400).json({
        message: "Username,Email and/or Password missing!",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "ERROR: Database failure when creating new user!",
      success: false,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const existing_user = await _getUser(username);
      if (existing_user === null) {
        return res
          .status(404)
          .json({ message: "User does not exist!", success: false });
      } else {
        const checkPassword = await bcrypt.compare(
          password,
          existing_user.password
        );
        if (checkPassword) {
          // generate and return JWT token
          const refreshToken = generateRefreshToken(username);
          const accessToken = generateAccessToken(username);
          return res.status(200).json({
            username: username,
            accessToken: accessToken,
            refreshToken: refreshToken,
            success: true,
          });
        } else {
          return res
            .status(401)
            .json({ message: "Incorrect password!", success: false });
        }
      }
    } else {
      return res.status(400).json({
        message: "Username and/or Password are missing!",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Database failure when retrieving user!",
      success: false,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const username = req.body.username;
    const accessToken = getJWTTokenFromAuthHeader(req.headers.authorization);
    console.log(accessToken);
    if (accessToken && username) {
      const payload = jwt.verify(accessToken, jwtAccessSecretKey);
      const decodedUsername = payload.username;
      if (decodedUsername != username) {
        return res.status(400).json({
          message: "Username and JWT token do not match.",
          success: false,
        });
      }
      const deleteUserSuccess = await _deleteUser(decodedUsername);
      if (deleteUserSuccess) {
        return res.status(200).json({
          username: decodedUsername,
          message: `Deleted user ${decodedUsername} successfully!`,
          success: true,
        });
      } else {
        return res.status(500).json({
          message: "Error deleting user from database",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "'Access token and/or username are missing!",
        success: false,
      });
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "JWT Token has Expired.", success: false });
    } else {
      return res
        .status(400)
        .json({ message: "Problem verifying JWT token.", success: false });
    }
  }
}

export async function updatePassword(req, res) {
  try {
    const username = req.body.username;
    const newPassword = req.body.newPassword;
    const accessToken = getJWTTokenFromAuthHeader(req.headers.authorization);
    if (username && accessToken && newPassword) {
      const decodedPayload = jwt.verify(accessToken, jwtAccessSecretKey);
      const updatedUser = await _updatePassword(username, newPassword);
      if (updatedUser === null) {
        return res
          .status(500)
          .json({ message: "Error updating user in database", success: false });
      } else {
        return res.status(200).json({
          username: updatedUser.username,
          message: `User ${updatedUser.username}'s password is updated successfully!`,
          success: true,
        });
      }
    } else {
      return res.status(400).json({
        message: "'Access token, username and/or new password are missing!",
        success: false,
      });
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "JWT Token has Expired.", success: false });
    } else {
      return res.status(400).json({
        message: "Problem verifying JWT token or updating user password.",
        success: false,
      });
    }
  }
}

export async function resetPassword(req, res) {
  try {
    const username = req.body.username;
    const newPassword = req.body.newPassword;
    const email = req.body.email;
    if (username && email && newPassword) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message:
            "Could not reset password, email format invalid. Email has to contain the @ and . character",
          success: false,
        });
      }
      const existingUser = await _getUser(username);
      var userEmail;
      if (existingUser) {
        userEmail = existingUser.email;
        if (!userEmail) {
          return res.status(500).json({
            message: "No email address for specified user",
            success: false,
          });
        }
        if (userEmail != email) {
          return res.status(400).json({
            message: "Email address does not match database records",
            success: false,
          });
        }
      }
      const updatedUser = await _updatePassword(username, newPassword);
      if (updatedUser === null) {
        return res
          .status(500)
          .json({ message: "Error updating user in database", success: false });
      } else {
        return res.status(200).json({
          username: updatedUser.username,
          message: `Reset user ${updatedUser.username} password successfully!`,
          success: true,
        });
      }
    } else {
      return res.status(400).json({
        message: "'Email address, username and/or new password are missing!",
        success: false,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Problem resetting user password.", success: false });
  }
}

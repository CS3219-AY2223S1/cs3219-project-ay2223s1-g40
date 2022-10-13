import jwt from "jsonwebtoken";
import { getJWTTokenFromAuthHeader } from "./user-controller.js";
import "dotenv/config";

const jwtAccessSecretKey = process.env.JWT_SECRET_KEY;
const jwtRefreshSecretKey = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRE_TIME = 900000;
const REFRESH_TOKEN_EXPIRE_TIME = 1200000;

let refreshTokens = [];

// Set clean up to happen every 20 minutes
var refreshTokensCleanupTimer = setInterval(cleanupRefreshTokens, 1200000);

// requestbody is of the format: {"username":"<username>", "password":"<password>"}
export function generateAccessToken(username) {
  try {
    // Entire requestbody(includes password) is passed  to jwt.sign to add more
    // variability to jwt token when user changes passwords
    const accessToken = jwt.sign({ username: username }, jwtAccessSecretKey, {
      expiresIn: "15m",
    });
    return accessToken;
  } catch (err) {
    console.log(err);
  }
}

export function generateRefreshToken(username) {
  try {
    const refreshToken = jwt.sign({ username: username }, jwtRefreshSecretKey, {
      expiresIn: "20m",
    });
    refreshTokens.push(refreshToken);
    return refreshToken;
  } catch (err) {
    console.log(err);
  }
}

export function validateAccessToken(req, res) {
  const username = req.body.username;
  const token = getJWTTokenFromAuthHeader(req.headers.authorization);
  if (token == undefined) {
    // bad request syntax
    return res.status(400).json({
      message:
        "Incorrect request body format, please specify a key value pair 'token':'<token>'",
      success: false,
    });
  }
  try {
    const decodedPayload = jwt.verify(token, jwtAccessSecretKey);
    const decodedUsername = decodedPayload.username;
    if (decodedUsername != username) {
      return res.status(400).json({
        message: "Username and JWT token do not match.",
        success: false,
      });
    }
    return res.status(200).json({ username: decodedUsername, success: true });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "JWT Token has Expired.", success: false });
    } else {
      return res.status(400).json({
        message:
          "Problem verifying JWT token, make sure you passed the access token.",
        success: false,
      });
    }
  }
}

export function renewAccessAndRefreshTokens(req, res) {
  const username = req.body.username;
  const refreshToken = getJWTTokenFromAuthHeader(req.headers.authorization);
  if (refreshToken == undefined) {
    // bad request syntax
    return res.status(400).json({
      message:
        "Incorrect request body format, please specify a key value pair 'token':'<token>'",
      success: false,
    });
  }
  // verify that refreshToken is valid
  try {
    const decodedPayload = jwt.verify(refreshToken, jwtRefreshSecretKey);
    const decodedUsername = decodedPayload.username;
    if (decodedUsername != username) {
      return res.status(400).json({
        message: "Username and JWT token do not match.",
        success: false,
      });
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res
        .status(401)
        .json({ message: "JWT refresh Token invalid.", success: false });
    }
    refreshTokens.filter((token) => token != refreshToken);
    const newAccessToken = generateAccessToken(decodedPayload.username);
    const newRefreshToken = generateRefreshToken(decodedPayload.username);
    return res.status(200).json({
      username: decodedPayload.username,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      success: true,
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "JWT refresh Token has Expired.", success: false });
    } else {
      console.log(err);
      return res.status(400).json({
        message:
          "Problem verifying JWT refresh token, , make sure you passed the refresh token.",
        success: false,
      });
    }
  }
}

export function invalidateRefreshToken(req, res) {
  const username = req.body.username;
  const refreshToken = getJWTTokenFromAuthHeader(req.headers.authorization);
  if (refreshToken == undefined) {
    // bad request syntax
    return res.status(400).json({
      message:
        "Incorrect request body format, please specify a key value pair 'token':'<token>'",
      success: false,
    });
  }
  try {
    const decodedPayload = jwt.verify(refreshToken, jwtRefreshSecretKey);
    const decodedUsername = decodedPayload.username;
    if (decodedUsername != username) {
      return res.status(400).json({
        message: "Username and JWT token do not match.",
        success: false,
      });
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res
        .status(401)
        .json({ message: "JWT refresh Token invalid.", success: false });
    }
    refreshTokens.filter((token) => token != refreshToken);

    return res.status(200).json({
      username: decodedPayload.username,
      message: "Successfully logged out",
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      message:
        "Problem invalidating refresh token, make sure you passed the refresh token.",
      success: false,
    });
  }
}

function cleanupRefreshTokens() {
  let newRefreshTokens = [];
  for (var i = 0; i < refreshTokens.length; i++) {
    const refreshToken = refreshTokens[i];
    try {
      jwt.verify(refreshToken, jwtRefreshSecretKey);
      newRefreshTokens.push(refreshToken);
    } catch (err) {
      continue;
    }
  }
  refreshTokens = newRefreshTokens;
}

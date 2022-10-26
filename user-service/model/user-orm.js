import {
  createUser,
  getUser,
  deleteUser,
  updatePassword,
  doesUserExist,
} from "./repository.js";
import bcrypt, { hash } from "bcrypt";

import jwt from "jsonwebtoken";

//need to separate orm functions from repository to decouple business logic from persistence
const SALT_ROUNDS = 10;

export async function ormCreateUser(username, password, email) {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({
      username: username,
      password: hashedPassword,
      email: email,
    });
    newUser.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormDoesUserExist(username) {
  try {
    const result = await doesUserExist(username);
    if (result === null) {
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.log("ERROR: Could not check that user exists");
    return { err };
  }
}

export async function ormLoginUser(username, password) {
  try {
    const findUser = await getUser(username);
    if (findUser === null) {
      return { success: false, message: "Username does not exist" };
    }
    const isPasswordEqual = await bcrypt.compare(password, findUser.password);
    if (isPasswordEqual) {
      const token = jwt.sign(findUser.toObject(), process.env.JWT_SECRET_KEY);
      return {
        success: true,
        token: token,
        userId: findUser._id,
        username: findUser.username,
      };
    }
    return { success: false, message: "Password is incorrect" };
  } catch (err) {
    console.log(err);
    console.log(`ERROR: Failed to retrieve user.`);
    return { err };
  }
}

export async function ormDeleteUser(username) {
  try {
    const { deletedCount } = await deleteUser(username);
    return { success: true, message: `Deleted ${username} user` };
  } catch (err) {
    console.log(`ERROR: Failed to delete user.`);
    return { err };
  }
}

export async function ormUpdatePassword(username, oldPassword, password) {
  try {
    const findUser = await getUser(username);
    if (findUser === null) {
      return { success: false, message: "Username does not exist" };
    }
    const checkPassword = await bcrypt.compare(oldPassword, findUser.password);
    if (checkPassword) {
      const hashedPassword = await hashPassword(password);
      const { acknowledged } = await updatePassword(username, hashedPassword);
      if (acknowledged) {
        return {
          success: true,
          status: 200,
          message: "Successfully updated password",
        };
      } else {
        return {
          success: false,
          status: 500,
          message: "Failed to update password",
        };
      }
    } else {
      return { success: false, status: 401, message: "Incorrect password" };
    }
  } catch (err) {
    console.log(`ERROR: Failed to update user password.`);
    return { err };
  }
}

// Helper functions
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

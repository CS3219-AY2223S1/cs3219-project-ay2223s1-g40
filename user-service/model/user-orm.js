import {
  createUser,
  getUser,
  deleteUser,
  updatePassword,
} from "./repository.js";
import bcrypt, { hash } from "bcrypt";

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

export async function ormGetUser(username) {
  let user = await getUser(username);
  return user;
}

export async function ormDeleteUser(username, password) {
  return await deleteUser(username);
}

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function ormUpdatePassword(username, newPassword) {
  const hashedNewPassword = await hashPassword(newPassword);
  return updatePassword(username, hashedNewPassword);
}

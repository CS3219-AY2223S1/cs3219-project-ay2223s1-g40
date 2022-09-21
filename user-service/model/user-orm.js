import { doesUserExist, getUser } from "./repository.js";
import bcrypt from "bcryptjs";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await createUser({ username, hashedPassword });
    newUser.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormDoesUserExist(username) {
  try {
    const exists = await doesUserExist(username);
    return exists;
  } catch (err) {
    return { err };
  }
}

export async function ormGetUser(username) {
  try {
    const user = await getUser(username);
    return user;
  } catch (err) {
    return { err };
  }
}

import { doesUserExist, getUser, createUser } from "./repository.js";
import bcrypt from "bcryptjs";
import { blacklistJwt, generateToken } from "../auth/index.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await createUser({
      username: username,
      password: hashedPassword,
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

export async function ormLoginUser(username, password) {
  try {
    const checkExist = await doesUserExist(username);
    if (!checkExist) {
      return null;
    }

    const user = await getUser(username);
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      return null;
    }

    const jwtToken = generateToken(user);
    user.save();
    return jwtToken;
  } catch (err) {
    console.log(`ERROR: Could not retrieve user: ${username}`);
    return { err };
  }
}

export async function ormLogoutUser(username, token) {
  try {
    const checkExist = await doesUserExist(username);
    if (!checkExist) {
      return false;
    }

    const user = await getUser(username);

    // auth
    const verify = await verifyToken(username, token);
    if (!verify || verify.err) {
      console.log(`ERROR: Verification failed for ${username}`);
      return false;
    }

    // blacklist
    const exp = verify.exp;
    if (!(await blacklistJwt(token, exp))) {
      console.log(
        `ERROR: Unable to add ${username}'s JWT Token to redis database`
      );
      return false;
    }
    return true;
  } catch (err) {
    console.log(`ERROR: Could not retrieve user: ${username}`);
    return { err };
  }
}

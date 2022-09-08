import { ormCreateUser as _createUser } from "../model/user-orm.js";
import { ormCheckUser as _checkUserbyUsername } from "../model/user-orm.js";

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    const checkDuplicate = await _checkUserbyUsername(username);
    if (checkDuplicate.length > 0) {
      console.log("The username already exists!");
      return res.status(409).json({ message: "The username already exists!" });
    }
    if (username && password) {
      const resp = await _createUser(username, password);
      console.log(resp);
      if (resp.err) {
        return res
          .status(400)
          .json({ message: "Could not create a new user!" });
      } else {
        console.log(`Created new user ${username} successfully!`);
        return res
          .status(201)
          .json({ message: `Created new user ${username} successfully!` });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}

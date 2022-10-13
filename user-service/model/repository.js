import UserModel from "./user-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

if (mongoDB == undefined) {
  mongoose.connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createUser(params) {
  return new UserModel(params);
}

// Returns the user document, if username does not exist, throws an error
export async function getUser(username) {
  let user = await UserModel.findOne({ username: username }).exec();
  return user;
}

export async function updatePassword(username, newPassword) {
  let updatedUser = await UserModel.findOneAndUpdate(
    { username: username },
    { password: newPassword }
  );
  return updatedUser;
}

export async function deleteUser(username) {
  const deletedCount = await (
    await UserModel.deleteOne({ username: username })
  ).deletedCount;
  return deletedCount == 1;
}

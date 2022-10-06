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

export async function doesUserExist(username) {
  return UserModel.exists({ username: username });
}

export async function getUser(username) {
  return UserModel.findOne({ username: username });
}

export async function deleteUser(username) {
  return await UserModel.deleteOne({ username: username });
}

export async function updateUser(userId, newPassword) {
  return await UserModel.updateOne(
    { password: newPassword },
    {
      where: { userId },
    }
  );
}

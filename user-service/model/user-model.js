import mongoose from "mongoose";
var Schema = mongoose.Schema;
export let UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model("UserModel", UserModelSchema);

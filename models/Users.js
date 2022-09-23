const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "You have entered existing email! Try to login!"],
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
  },
  timeStamp: {
    type: String,
    required: [true],
  },
  lastLog: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;

// userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  profilePicture: {
    type: Buffer,
    required: false,
    unique: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"], // Only allows 'admin' or 'user'
    default: "user", // Default role is 'user' if not specified
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

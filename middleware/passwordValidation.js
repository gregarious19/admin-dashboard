const { connect } = require("mongoose");
const User = require("../Model/userModel.js");
const bcrypt = require("bcrypt");

const verifyPassword = async (req, res, next) => {
  const { email, currentPassword } = req.body;

  const userId = req.userId;
  console.log(currentPassword);

  try {
    let foundUser =
      (await User.findById(userId)) || (await User.findOne({ email }));
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      foundUser.password
    );
    // console.log(passwordMatch);
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!passwordMatch) {
      return res.status(401).json({ error: "Wrong Password" });
    } else {
      // console.log("hi");
      next();
    }
  } catch (error) {
    console.error("Error finding user by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = verifyPassword;

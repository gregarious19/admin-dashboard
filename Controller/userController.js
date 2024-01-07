// controllers/userController.js
const User = require("../Model/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userController = {
  loginUser: async (req, res) => {
    const { email, currentPassword } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // If the credentials are valid, generate a JWT token
      const token = jwt.sign(
        { userId: user._id },
        "plk4bds7dthd3i7y3e893hed38hd983",
        {
          expiresIn: "1h", // Token expiration time (adjust as needed)
        }
      );

      // Return the token and user information
      res
        .status(200)
        .json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getUserById: async (req, res) => {
    const userId = req.userId;

    try {
      const foundUser = await User.findById(userId);

      if (!foundUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "User found successfully",
        user: {
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          profilePicture: foundUser.profilePicture?.toString("base64"), // Convert Buffer to base64
        },
      });
    } catch (error) {
      console.error("Error finding user by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const loggedInUserId = req.userId;
      const user = await User.findById(loggedInUserId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const users = await User.find({ _id: { $ne: loggedInUserId } });

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const status = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "user deleted successfully" });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  updateUserById: async (req, res) => {
    const userId = req.params.id;

    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, password: hashedPassword },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  changePasswordById: async (req, res) => {
    const userId = req.userId;
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createUser: async (req, res) => {
    const { name, email, phone, password } = req.body; // Assuming you send name, email, and role in the request body
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
      });
      const token = jwt.sign(
        { userId: newUser._id },
        "plk4bds7dthd3i7y3e893hed38hd983",
        {
          expiresIn: "15m",
        }
      );
      res
        .status(201)
        .json({ message: "User created successfully", newUser, token });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  updateProfilePicture: async (req, res) => {
    const userId = req.userId;
    const profilePicture = req.file;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the profile picture if a new one is provided
      if (profilePicture) {
        user.profilePicture = profilePicture.buffer;
        await user.save();
      }

      res
        .status(200)
        .json({ message: "Profile picture updated successfully", user });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Add more controller methods for creating, updating, and deleting users
};

module.exports = userController;

// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../Controller/userController.js");
const verifyToken = require("../middleware/auth.js");
const verifyPassword = require("../middleware/passwordValidation.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Update user profile picture
router.put(
  "/profile-picture",
  verifyToken,
  upload.single("profilePicture"),
  userController.updateProfilePicture
);

// Route for users
router.get("/user", verifyToken, userController.getUserById);
router.post("/user", userController.createUser);
router.get("/users", verifyToken, userController.getAllUsers);
router.delete("/user/:id", verifyToken, userController.deleteUser);
router.put("/user/:id", verifyToken, userController.updateUserById);
router.put(
  "/change-password",
  verifyToken,
  verifyPassword,
  userController.changePasswordById
);
router.post("/login", verifyPassword, userController.loginUser);
// Add more routes for creating, updating, and deleting users

module.exports = router;

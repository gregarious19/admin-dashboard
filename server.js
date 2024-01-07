// app.js

const express = require("express");
const bodyParser = require("body-parser");
const User = require("./Model/userModel.js"); // Import the userModel.js file
const userRoutes = require("./Routes/userRoutes.js");
const db = require("./config/db.js");

const app = express();
const port = process.env.PORT || 3001;

// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", express.static("public/Signup"));
app.use(express.static("public"));
app.use("/api", userRoutes);

// View Users Route

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

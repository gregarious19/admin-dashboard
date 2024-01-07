// db.js
const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/Dashboard";

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = db;

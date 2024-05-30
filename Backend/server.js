const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
require("dotenv").config();
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
require("./UserDetails");
const User = mongoose.model("UserInfo");
const bcrypt = require("bcryptjs");

//const mongoUrl = process.env.MONGODB_URI;
const mongoUrl =
  "mongodb+srv://sadna20232024:sadna2024@cluster0.ulirpbk.mongodb.net/dishcover_db?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => {
    console.error(e);
  });

// Defining a route for handling client communication
app.get("/", (req, res) => {
  res.send({ statuse: "Started" });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const oldUserWithSameEmail = await User.findOne({ email: email });
  if (oldUserWithSameEmail) {
    return res.send({
      status: "error",
      data: "User already exists with this email.",
    });
  }

  const oldUserWithSameName = await User.findOne({ name: name });
  if (oldUserWithSameName) {
    return res.send({
      status: "error",
      data: "User already exists with this name.",
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "User created successfully" });
  } catch (e) {
    res.send({ status: "error", data: e.message });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

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
const jwt = require("jsonwebtoken");

const mongoUrl = process.env.MONGODB_URI;
const JWET_SECRET = process.env.JWT_SECRET;

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

app.post("/signin", async (req, res) => {
  const { id, password } = req.body;
  const oldUser = await User.findOne({ $or: [{ email: id }, { name: id }] });

  if (!oldUser) {
    return res.send({ status: "error", data: "User doesn't exists." });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign(
      { id: oldUser._id, email: oldUser.email },
      JWET_SECRET
    );
    if (res.status(201)) {
      return res.send({ status: "ok", data: token });
    } else {
      return res.send({ status: "error", data: "Error" });
    }
  } else {
    return res.send({ status: "error", data: "Invalid Password" });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

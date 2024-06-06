const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoUrl = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Import the schemas/models
require("./UserDetails");
require("./RestaurantsDetails");

const User = mongoose.model("UserInfo");
const Restaurants = mongoose.model("restaurants");

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

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
      JWT_SECRET
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

app.get("/image", async (req, res) => {
  const { restaurantNames } = req.query;
  console.log(`Received request for restaurant: ${restaurantNames}`); // Log the received parameter

  try {
    const restaurantsData = await Restaurants.find(
      {
        name: { $in: restaurantNames },
      },
      { name: 1, image: 1 } // Projection to include only the name and image fields
    );

    if (restaurantsData && restaurantsData.length > 0) {
      console.log(`Database query result: ${restaurantsData}`); // Log the query result
      res.send({ status: "ok", data: restaurantsData });
    } else {
      res.send({
        status: "error",
        data: "No listings found with the given names.",
      });
    }
  } catch (e) {
    res.send({
      status: "error",
      data: e.message,
    });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

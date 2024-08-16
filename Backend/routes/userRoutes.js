const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { calculateDominantDistrict } = require("../utils/helpers"); // Import the helper function
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Reviews = require("../models/Review");
const JWT_SECRET = process.env.JWT_SECRET; // Ensure JWT_SECRET is managed securely
require("dotenv").config();

const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Check if user exists by name
router.get("/checkUserByName", async (req, res) => {
  const { name } = req.query;

  try {
    const userExists = await User.exists({ name });
    if (userExists) {
      return res.status(200).json({
        exists: true,
        message: "User already exists with this name.",
      });
    }
    return res.status(200).json({
      exists: false,
      message: "Name is available.",
    });
  } catch (error) {
    console.error("Error checking name:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Check if user exists by email
router.get("/checkUserByEmail", async (req, res) => {
  const { email } = req.query;

  try {
    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(200).json({
        exists: true,
        message: "User already exists with this email.",
      });
    }
    return res.status(200).json({
      exists: false,
      message: "Email is available.",
    });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// User signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    res.status(201).json({ status: "ok", data: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ status: "error", data: "Failed to create user" });
  }
});

// User signin
router.post("/signin", async (req, res) => {
  const { id, password } = req.body;

  try {
    const oldUser = await User.findOne({ $or: [{ email: id }, { name: id }] });
    if (!oldUser) {
      return res
        .status(404)
        .json({ status: "error", data: "User doesn't exist." });
    }

    const passwordMatch = await bcrypt.compare(password, oldUser.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: "error", data: "Invalid password" });
    }

    const token = jwt.sign(
      { id: oldUser._id, email: oldUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ status: "ok", data: token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ status: "error", data: "Failed to signin" });
  }
});

// Update places user has visited
router.post("/placesUserVisit", async (req, res) => {
  const { username, placesVisited } = req.body;

  try {
    // Save placesVisited to user collection
    const updatedUser = await User.findOneAndUpdate(
      { name: username },
      { $addToSet: { placesVisited: { $each: placesVisited } } }, // Use $addToSet to ensure uniqueness
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ status: "error", data: "User not found" });
    }

    // Find the updated list of placesVisited
    const updatedPlacesVisited = updatedUser.placesVisited;

    // Retrieve restaurant details for the updated placesVisited using aggregation to remove duplicates
    const restaurantsDataFromDB = await Restaurant.aggregate([
      { $match: { name: { $in: updatedPlacesVisited } } },
      {
        $group: {
          _id: "$name",
          name: { $first: "$name" },
          district: { $first: "$district" },
        },
      },
    ]);

    // Calculate the dominant district using the helper function
    const dominantDistrict = calculateDominantDistrict(restaurantsDataFromDB);

    // Update the user's district field with the dominant district
    await User.updateOne(
      { name: username },
      { $set: { district: dominantDistrict } }
    );

    if (restaurantsDataFromDB.length > 0) {
      res.send({ status: "ok", data: restaurantsDataFromDB });
    } else {
      res.status(404).send({
        status: "error",
        data: "No listings found with the given names.",
      });
    }
  } catch (error) {
    console.error("Places user visit error:", error);
    res.status(500).json({
      status: "error",
      data: "Failed to process request",
    });
  }
});

// Update places user want to visit
router.post("/updatePlacesUserWantToVisit", async (req, res) => {
  const { username, placesToVisit } = req.body;

  try {
    // Save placesToVisit to user collection
    const updatedUser = await User.findOneAndUpdate(
      { name: username },
      { $addToSet: { placesToVisit: { $each: placesToVisit } } }, // Use $addToSet to ensure uniqueness
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ status: "error", data: "User not found" });
    }
    res.send({ status: "ok" });
  } catch (e) {
    res.status(500).send({
      status: "error",
      data: e.message,
    });
  }
});

// Add a review to restaurant by user
router.post("/reviewByUser", async (req, res) => {
  const {
    username,
    restaurantName,
    foodRating,
    serviceRating,
    cleanlinessRating,
    vibesRating,
    additionalComments,
  } = req.body;

  if (!username || !restaurantName) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Find the user's ID
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const userId = user._id;

    // Check if the restaurant exists
    let restaurant = await Reviews.findOne({ name: restaurantName });

    if (!restaurant) {
      restaurant = new Reviews({ name: restaurantName, reviews: [] });
    }

    const newReview = {
      customerId: userId,
      foodScore: foodRating,
      serviceScore: serviceRating,
      cleanlinessScore: cleanlinessRating,
      atmosphereScore: vibesRating,
      comments: additionalComments || " ",
    };

    // Add the new review to the restaurant's reviews array
    restaurant.reviews.push(newReview);
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete a restaurant from user's placesToVisit
router.delete("/deleteRestaurantFromPlacesToVisit", async (req, res) => {
  const { username, restaurantName, visited } = req.body;

  if (!username || !restaurantName) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Find the user
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Remove the restaurant from the user's wishlist
    user.placesToVisit = user.placesToVisit.filter(
      (restaurant) => restaurant !== restaurantName
    );

    // If the restaurant is visited, add it to the placesVisited list
    if (visited) {
      if (!user.placesVisited.includes(restaurantName)) {
        user.placesVisited.push(restaurantName);
      }
    }

    // Save the updated user document
    await user.save();

    res.status(200).send({ message: "Restaurant updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Fetch user's wishlist (from placesToVisit Array and Restaurants collection)
router.get("/getPlacesUserWantToVisit", async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("user.placesToVisit:", user.placesToVisit);

    const restaurants = await Restaurant.aggregate([
      { $match: { name: { $in: user.placesToVisit } } },
      {
        $group: {
          _id: "$name", // Group by restaurant name to remove duplicates
          restaurantData: { $first: "$$ROOT" }, // Get the first occurrence of the restaurant data
        },
      },
      {
        $replaceRoot: {
          newRoot: "$restaurantData", // Replace the root with the restaurant data
        },
      },
    ]);

    console.log("Restaurants:", restaurants);

    res.status(200).send({ placesToVisit: restaurants });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Fetch user's restaurants recommendations
router.get("/restaurantsRecommendations", async (req, res) => {
  const {
    userName,
    selectedDistrict,
    selectedTypes,
    selectedBudget,
    selectedAtmosphere,
    isVegan,
    isGlutenFree,
    isWheelchairAccessible,
  } = req.query;

  console.log(req.query);

  //TODO: Implement this function
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET; // Ensure JWT_SECRET is managed securely
const { getMostVisitedDistrict } = require("../utils/helpers"); // Import the helper function
const { User } = require("../models/User.js");
const Restaurant = require("../models/Restaurant.js");
const RestaurantsReviews = require("../models/Review.js");

//restaurantReviewsSchema
const axios = require("axios");

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
    // Check if a user with the same name or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      // Return a specific message if the name or email already exists
      return res.status(409).json({
        status: "error",
        data: "Username or email already exists.",
      });
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    res.status(201).json({
      status: "ok",
      data: { userId: newUser._id.toString() },
    });
  } catch (error) {
    console.error("Signup error:", error);
    // Check for duplicate key error specifically and respond accordingly
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        data: "Duplicate key error: User already exists.",
      });
    }
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

    res.status(200).json({
      status: "ok",
      data: {
        token,
        userId: oldUser._id.toString(),
        userName: oldUser.name,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ status: "error", data: "Failed to signin" });
  }
});

// Update places user has visited
router.post("/placesUserVisited", async (req, res) => {
  const { userName, placesVisited } = req.body;
  console.log(userName);
  try {
    // Save placesVisited to user collection
    const updatedUser = await User.findOneAndUpdate(
      { name: userName },
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
          mainImage: { $first: "$mainImage" },
          name: { $first: "$name" },
        },
      },
    ]);

    // Calculate the dominant district using the helper function
    const dominantDistrict = await getMostVisitedDistrict(
      restaurantsDataFromDB
    );

    // Update the user's district field with the dominant district
    await User.updateOne(
      { name: userName },
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
  const { userName, placesToVisit } = req.body;
  console.log(userName);
  try {
    // Save placesToVisit to user collection
    const updatedUser = await User.findOneAndUpdate(
      { name: userName },
      { $addToSet: { placesToVisit: { $each: placesToVisit } } }, // $addToSet to ensure uniqueness
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
/*
router.post("/reviewByUser", async (req, res) => {
  const {
    //userId,
    userName,
    restaurantName,
    foodRating,
    serviceRating,
    cleanlinessRating,
    vibesRating,
    additionalComments,
  } = req.body;

  if (!userName || !restaurantName) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Find the user's ID
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const userId = user._id;

    // Find the restaurant's ID
    const restaurant = await Restaurant.findOne({ name: restaurantName });
    if (!restaurant) {
      return res.status(404).send({ message: "Restaurant not found" });
    }
    const restaurantId = restaurant._id;

    // Check if the restaurant exists in the Reviews collection
    let restaurantReviews = await RestaurantsReviews.findOne({
      restaurantId: restaurantId,
    });

    if (!restaurantReviews) {
      restaurantReviews = new Review({
        name: restaurantName,
        restaurantId: restaurantId,
        reviews: [],
      });
    }

    const newReview = {
      customerId: userId,
      foodScore: foodRating,
      cleanlinessScore: cleanlinessRating,
      serviceScore: serviceRating,
      atmosphereScore: vibesRating,
      comments: additionalComments || " ",
    };

    // Add the new review to the restaurant's reviews array
    restaurantReviews.reviews.push(newReview);
    await restaurantReviews.save();
    res.status(201).send(restaurantReviews);
  } catch (error) {
    console.error("Error processing review:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
*/

router.post("/reviewByUser", async (req, res) => {
  const {
    userName,
    restaurantName,
    foodRating,
    serviceRating,
    cleanlinessRating,
    vibesRating,
    additionalComments,
  } = req.body;

  // Validate required fields
  if (!userName || !restaurantName) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Find the user by name
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const userId = user._id;

    // Find the restaurant by name
    const restaurant = await Restaurant.findOne({ name: restaurantName });
    if (!restaurant) {
      return res.status(404).send({ message: "Restaurant not found" });
    }
    const restaurantId = restaurant._id;

    // Check if the restaurant exists in the Reviews collection
    let restaurantReviews = await RestaurantsReviews.findOne({
      restaurantId: restaurantId,
    });

    // If the restaurant does not have reviews yet, create a new entry
    if (!restaurantReviews) {
      restaurantReviews = new RestaurantsReviews({
        name: restaurantName,
        restaurantId: restaurantId,
        reviews: [],
      });
    }

    // Create a new review
    const newReview = {
      customerId: userId.toString(), // Ensure userId is a string
      foodScore: foodRating,
      cleanlinessScore: cleanlinessRating,
      serviceScore: serviceRating,
      atmosphereScore: vibesRating,
      comments: additionalComments || "No additional comments",
    };

    // Add the new review to the restaurant's reviews array
    restaurantReviews.reviews.push(newReview);
    await restaurantReviews.save();

    res
      .status(201)
      .send({ message: "Review added successfully", restaurantReviews });
  } catch (error) {
    console.error("Error processing review:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete a restaurant from user's placesToVisit
router.delete("/deleteRestaurantFromPlacesToVisit", async (req, res) => {
  const { userName, restaurantName } = req.body;

  if (!userName || !restaurantName) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Find the user
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Remove the restaurant from the user's wishlist
    user.placesToVisit = user.placesToVisit.filter(
      (restaurant) => restaurant !== restaurantName
    );

    // Save the updated user document
    await user.save();

    res.status(200).send({
      message: "Restaurant updated successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Fetch user's wishlist (from placesToVisit Array and Restaurants collection)
router.get("/getPlacesUserWantToVisit", async (req, res) => {
  const { userName } = req.query;

  try {
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
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

    // Send the response in the order specified by user.placesToVisit
    const orderedRestaurants = user.placesToVisit.map((name) =>
      restaurants.find((restaurant) => restaurant.name === name)
    );

    res.status(200).send({ placesToVisit: orderedRestaurants });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Fetch user's visited restaurants (from placesVisited Array and Restaurants collection)
router.get("/getPlacesUserVisited", async (req, res) => {
  const { userName } = req.query;

  try {
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const placesVisited = user.placesVisited; // Order specified by user

    // Aggregate the restaurants
    const restaurants = await Restaurant.aggregate([
      { $match: { name: { $in: placesVisited } } },
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

    // Create a map for quick lookups
    const restaurantMap = new Map(
      restaurants.map((restaurant) => [restaurant.name, restaurant])
    );

    // Filter out any places that don't exist in the restaurantMap
    const orderedRestaurants = placesVisited
      .map((name) => restaurantMap.get(name))
      .filter((restaurant) => restaurant !== undefined);
    /*
          
    // Send the response in the order specified by user.placesVisited
    const orderedRestaurants = placesVisited.map((name) =>
      restaurants.find((restaurant) => restaurant.name === name)
    );
*/
    res.status(200).send({ placesVisited: orderedRestaurants });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Fetch user's restaurants recommendations
router.get("/restaurantsRecommendations", async (req, res) => {
  const {
    userId = "",
    selectedDistrict = "",
    selectedTypes = "",
    selectedBudget = "",
    selectedAtmosphere = "",
    isVegan = "",
    isGlutenFree = "",
    isWheelchairAccessible = "",
  } = req.query;

  try {
    // Fetch user details
    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch user reviews from the "restaurants_review" collection
    const reviews = await RestaurantsReviews.aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews.customerId": userId } },
      { $replaceRoot: { newRoot: "$reviews" } },
    ]);

    // Prepare the user query data
    const userQuery = {
      filters: {
        types: selectedTypes,
        budget: selectedBudget,
        atmosphere: selectedAtmosphere,
        dietary: {
          vegan: isVegan,
          gluten_free: isGlutenFree,
        },
        accessibility: {
          wheelchair_accessible: isWheelchairAccessible,
        },
        district: selectedDistrict,
      },
      reviews: reviews,
    };

    // Prepare request data for Python server
    const requestData = {
      user_query_json: JSON.stringify(userQuery), // Ensure JSON string for Python
    };

    // Send a POST request to the Python server
    // const response = await axios.post('http://localhost:5000/recommend', requestData);
    const response = await axios.post(
      "http://localhost:5000/recommend",
      requestData
      /* {
        timeout: 0, // This disables the timeout
      }*/
    );

    if (response.status === 200) {
      // Send the recommendations back to the client
      /*
      const responseData = Array.isArray(response.data) ? response.data : [];

    // Send the recommendations back to the client
    console.log("Python res: ", responseData);
    res.status(200).json(responseData);

*/
      /*
      console.log("Python res: ", response.data);
      res.status(200).json(response.data);
      */
      let data = response.data;

      // Replace NaN with null in the response data
      data = JSON.parse(JSON.stringify(data).replace(/NaN/g, "null"));

      res.json(data);
    } else {
      res
        .status(response.status)
        .json({ error: "Failed to get recommendations from Python server" });
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

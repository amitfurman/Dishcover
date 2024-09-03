// Import the Express module
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
const mongoURI = process.env.MONGODB_URI;
const restaurantRoutes = require("./routes/restaurantRoutes");
const userRoutes = require("./routes/userRoutes");
// const routes = require("./routes");

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");

    // Use routes only after successful connection
    app.use("/api/restaurants", restaurantRoutes); // Prefix routes
    app.use("/api/users", userRoutes); // Prefix routes

    // Start the server after successful connection and route setup
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Handle graceful shutdown on termination signals
process.on("SIGINT", () => {
  mongoose.disconnect(() => {
    console.log("MongoDB disconnected through app termination");
    process.exit(0);
  });
});

//-------------------------------------------------
// // Test -  Connect to MongoDB using Mongoose
// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     console.log("MongoDB connected");

//     // Use the native MongoDB driver to perform a test query
//     const db = mongoose.connection.db;
//     return db.collection('restaurants').findOne({});
//   })
//   .then((restaurant) => {
//     console.log('Test query result:', restaurant);
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error or query error:", err);
//   });

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const Restaurant = require("../models/Restaurant");
// const Reviews = require("../models/Review.js");
//const JWT_SECRET = process.env.JWT_SECRET; // Ensure JWT_SECRET is managed securely

// mongoose.connection.once('open', async () => {
//   console.log('MongoDB connected');
//   const restaurant = await Restaurant.findOne({}); // Retrieve one restaurant for testing
//   console.log('Test query result:', restaurant);
//   mongoose.connection.close();
// });

// Handle 404 errors
// app.use((req, res, next) => {
//   res.status(404).send("Route not found");
// });

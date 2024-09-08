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

// Handle 404 errors
// app.use((req, res, next) => {
//   res.status(404).send("Route not found");
// });

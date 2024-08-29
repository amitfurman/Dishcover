// Import the Express module
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
const mongoURI = process.env.MONGODB_URI;
const restaurantRoutes = require("./routes/restaurantRoutes");

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");

    // Use routes only after successful connection
    app.use("/api/restaurants", restaurantRoutes); // Prefix routes

    // Start the server after successful connection and route setup
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


// app.use("/api/users", userRoutes); // Prefix routes

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



//const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const Restaurant = require("../models/Restaurant");
// const Reviews = require("../models/Review.js");
 //const JWT_SECRET = process.env.JWT_SECRET; // Ensure JWT_SECRET is managed securely


// //const routes = require("./routes");
// const userRoutes = require("./routes/userRoutes");
//const restaurantRoutes = require("./routes/restaurantRoutes");



// const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({}, { collection: 'restaurants' }));

// mongoose.connection.once('open', async () => {
//   console.log('MongoDB connected');
//   const restaurant = await Restaurant.findOne({}); // Retrieve one restaurant for testing
//   console.log('Test query result:', restaurant);
//   mongoose.connection.close();
// });


// //app.use("/api", routes);
// app.use("/api/users", userRoutes); // Prefix routes
//app.use("/api/restaurants", restaurantRoutes); // Prefix routes

// Start the server on port 3000
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Handle 404 errors
// app.use((req, res, next) => {
//   res.status(404).send("Route not found");
// });

// // Define API routes
// app.get('/api/transform', async (req, res) => {
//   const client = await connectToMongoDB();
//   const data = await transformAndUploadData(client);
//   await closeMongoDBConnection(client);
//   res.json(data);
// });

// app.get('/api/random-restaurants', async (req, res) => {
//   const { district, count } = req.query;
//   const client = await connectToMongoDB();
//   const data = await getRandomRestaurantsByDistrict(client, district, parseInt(count));
//   await closeMongoDBConnection(client);
//   res.json(data);
// });

// app.get('/api/user-random-restaurants', async (req, res) => {
//   const { userId } = req.query;
//   const client = await connectToMongoDB();
//   const data = await getRandomRestaurantsBasedOnUser(client, userId, 50);
//   await closeMongoDBConnection(client);
//   res.json(data);
// });
// // Usage
// async function main() {
//   const client = await connectToMongoDB();
//   //await transformAndUploadData(client);
//   await closeMongoDBConnection(client);
// }

// main();

// // Define a route handler for the default home page
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

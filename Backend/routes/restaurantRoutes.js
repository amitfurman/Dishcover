const express = require("express");
const router = express.Router();
const {
  getRandomRestaurantsBasedOnUser,
  getRandomRestaurantsByDistrict,
  getTopRestaurants,
} = require("../utils/helpers"); // Import the helper function
// const Restaurant = require("../models/Restaurant");

// get random 'count' restaurants in the given district
router.get("/random-restaurants", async (req, res) => {
  const { district, count } = req.query;

  try {
    const data = await getRandomRestaurantsByDistrict(
      district,
      parseInt(count)
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching random restaurants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//'count' is used to retrieve the number of random restaurants requested by the client in the /user-random-restaurants endpoint
router.get("/user-random-restaurants", async (req, res) => {
  const { userId } = req.query;
  const COUNT = 50;

  try {
    const data = await getRandomRestaurantsBasedOnUser(userId, parseInt(COUNT));
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching user-specific random restaurants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get the top 10 restaurants
router.get("/top-restaurants", async (req, res) => {
  try {
    const TOP_RESTAURANT_LIMIT = 10;
    const topRestaurants = await getTopRestaurants(TOP_RESTAURANT_LIMIT);
    res.json(topRestaurants);
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

//----------------
// // Basic test route to check database connection
// router.get("/test-restaurant-query", async (req, res) => {
//   try {
//     // Perform a basic query, e.g., find the first restaurant in the collection
//     const restaurant = await Restaurant.findOne();
//     if (restaurant) {
//       res.json({ success: true, message: "Successfully queried the restaurant collection", restaurant });
//     } else {
//       res.json({ success: false, message: "No restaurants found in the collection" });
//     }
//   } catch (error) {
//     console.error("Error querying restaurant collection:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });
// // get the top 10 restaurants
// router.get("/TopRestaurants", async (req, res) => {
//   //TODO: Implement this function
//   //return restaurants data like this:
//   /*
//   {
//     name: "Restaurant 1",
//     image: "https://via.placeholder.com/150",
//     score: 9.5,
//   },
//   */
// });

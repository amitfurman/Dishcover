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


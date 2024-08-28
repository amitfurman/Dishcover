const express = require("express");
const router = express.Router();
/*
const {
  getRandomRestaurantsByDistrict,
  getRandomRestaurantsBasedOnUser,
} = require("./transform");
const { connectToMongoDB, closeMongoDBConnection } = require("./dal");

router.get("/random-restaurants", async (req, res) => {
  const { district, count } = req.query;
  const client = await connectToMongoDB();
  const data = await getRandomRestaurantsByDistrict(
    client,
    district,
    parseInt(count)
  );
  await closeMongoDBConnection(client);
  res.json(data);
});

//'count' is used to retrieve the number of random restaurants requested by the client in the /user-random-restaurants endpoint
router.get("/user-random-restaurants", async (req, res) => {
  const { userId, count } = req.query;
  const client = await connectToMongoDB();
  const data = await getRandomRestaurantsBasedOnUser(
    client,
    userId,
    parseInt(count)
  );
  await closeMongoDBConnection(client);
  res.json(data);
});
*/
// get the top 10 restaurants
router.get("/TopRestaurants", async (req, res) => {
  //TODO: Implement this function
  //return restaurants data like this:
  /*
  {
    name: "Restaurant 1",
    image: "https://via.placeholder.com/150",
    score: 9.5,
  },
  */
});

module.exports = router;

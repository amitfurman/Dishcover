const mongoose = require("mongoose");
const { DATABASE_NAME, COLLECTIONS } = require('../dal/constants');
const { User } = require("../models/User");
const Restaurant = require("../models/Restaurant"); // Import the Restaurant model

//TODO: Remove 'client' as param

 //async function getRandomRestaurantsByDistrict(client, district, numberOfRestaurants) {
  const getRandomRestaurantsByDistrict = async (/*client,*/ district, numberOfRestaurants) => {
    try {
      //TODO: Remove next 2 lines
      // const db = client.db(DATABASE_NAME);
      // const collection = db.collection(COLLECTIONS.RESTAURANTS);
       // Query for matching restaurants in the specified district

     const matchingRestaurants = await Restaurant.find({ district }).lean();
  
      //TODO: Remove next 2 lines
      // const query = { district: district };
      // const matchingRestaurants = await collection.find(query).toArray();
  
      // If requested number of restaurants is more than available, limit to available restaurants
      const availableSameDistrictRestaurants = matchingRestaurants.length;
      const numberOfSameDistrictRestaurants = Math.min(Math.ceil(0.9 * numberOfRestaurants), availableSameDistrictRestaurants);
      const numberOfDifferentDistrictRestaurants = Math.max(numberOfRestaurants - availableSameDistrictRestaurants, 0);
  
      // Efficient shuffling using Fisher-Yates algorithm
      for (let i = matchingRestaurants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matchingRestaurants[i], matchingRestaurants[j]] = [matchingRestaurants[j], matchingRestaurants[i]];
      }
  
      const sameDistrictRestaurants = matchingRestaurants.slice(0, numberOfSameDistrictRestaurants);
  
      // Handle if there are not enough different district restaurants available
      let differentDistrictRestaurants = [];
      if (numberOfDifferentDistrictRestaurants > 0) {
        differentDistrictRestaurants = await Restaurant.aggregate([
          { $match: { district: { $ne: district } } },
          { $sample: { size: numberOfDifferentDistrictRestaurants } }
        ]);
      }
  
      return sameDistrictRestaurants.concat(differentDistrictRestaurants);
    } catch (err) {
      console.error('Error: could not retrieve random restaurants by district', err);
      return [];
    }
  }
  
  
  const getMostVisitedDistrict = (restaurantsData) => {
    const districtCount = {};
  
    // Count occurrences of each district
    restaurantsData.forEach((restaurant) => {
      const district = restaurant.district; 
      if (district) {
      districtCount[district] = (districtCount[district] || 0) + 1;
      }
    });
  
    // Find the district with the maximum count
    const dominantDistrict = Object.keys(districtCount).reduce(
      (a, b) => (districtCount[a] > districtCount[b] ? a : b),
      ''
    );
  
    console.log("Dominant District:", dominantDistrict);
    return dominantDistrict;
  };

  // Function to get random restaurants based on the user's most visited district
  //async function getRandomRestaurantsBasedOnUser(client, userId, numberOfRestaurants) {
  const getRandomRestaurantsBasedOnUser = async (/*client,*/ userId, numberOfRestaurants) => {
    try {
    //const db = client.db(DATABASE_NAME);
    //const usersCollection = db.collection(COLLECTIONS.USER_INFO);

    // Find the user using Mongoose
    const user = await User.findById(userId).lean();
    //const user = await usersCollection.findOne({ _id: ObjectId(userId) });
  
    // Check if the user exists and has visited restaurants
    if (!user || !user.placesVisited || user.placesVisited.length === 0) {
      return [];
    }

    const mostVisitedDistrict = getMostVisitedDistrict(user.placesVisited);
  
    return await getRandomRestaurantsByDistrict(/*client,*/ mostVisitedDistrict, numberOfRestaurants);
    } catch (err) {
      console.error('Error: could not retrieve random restaurants based on user', err);
      return [];
    }
  }

  module.exports = { getRandomRestaurantsByDistrict, getMostVisitedDistrict, getRandomRestaurantsBasedOnUser};
  
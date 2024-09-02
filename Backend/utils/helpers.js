const { User } = require("../models/User");
const Restaurant = require("../models/Restaurant"); // Import the Restaurant model
const { DEFAULT_MAIN_IMAGE } = require('../dal/constants');

// Helper function to get restaurants from the same district
const getSameDistrictRestaurants = async (district, numberOfRestaurants) => {
    try {
        const matchingRestaurants = await Restaurant.find({ district }).lean();

        // Efficient shuffling using Fisher-Yates algorithm
        for (let i = matchingRestaurants.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [matchingRestaurants[i], matchingRestaurants[j]] = [matchingRestaurants[j], matchingRestaurants[i]];
        }

        return matchingRestaurants.slice(0, numberOfRestaurants);
    } catch (err) {
        console.error('Error: could not retrieve same district restaurants', err);
        return [];
    }
};

// Helper function to get restaurants from different districts
const getDifferentDistrictRestaurants = async (district, numberOfRestaurants) => {
    try {
        const differentDistrictRestaurants = await Restaurant.aggregate([
            { $match: { district: { $ne: district } } },
            { $sample: { size: numberOfRestaurants } }
        ]);

        return differentDistrictRestaurants;
    } catch (err) {
        console.error('Error: could not retrieve different district restaurants', err);
        return [];
    }
};

// Main function to get random restaurants by district
const getRandomRestaurantsByDistrict = async (district, numberOfRestaurants) => {
    try {
        const totalRestaurants = numberOfRestaurants;

        // 90% from the same district
        const numberOfSameDistrictRestaurants = Math.ceil(0.9 * totalRestaurants);
        const sameDistrictRestaurants = await getSameDistrictRestaurants(district, numberOfSameDistrictRestaurants);

        // 10% from different districts
        const numberOfDifferentDistrictRestaurants = totalRestaurants - sameDistrictRestaurants.length;
        const differentDistrictRestaurants = await getDifferentDistrictRestaurants(district, numberOfDifferentDistrictRestaurants);

        return sameDistrictRestaurants.concat(differentDistrictRestaurants);
    } catch (err) {
        console.error('Error: could not retrieve random restaurants by district', err);
        return [];
    }
};


// Helper function to fetch restaurant details by name
const getRestaurantByName = async (restaurantName) => {
  try {
    const restaurant = await Restaurant.findOne({ name: restaurantName }).lean();
    return restaurant ? restaurant.district : null;
  } catch (error) {
    console.error(`Error fetching restaurant by name (${restaurantName}):`, error);
    return null;
  }
};

const getMostVisitedDistrict = async (restaurantsData) => {
  const districtCount = {};

  // Loop through the restaurantsData array
  for (const restaurant of restaurantsData) {
    let district;

    // If restaurant is an object, directly access the district
    if (typeof restaurant === 'object' && restaurant.district) {
      district = restaurant.district;
    } else if (typeof restaurant === 'string') { // If restaurant is a string (name), fetch the district
      district = await getRestaurantByName(restaurant);
    }

    if (district) {
      districtCount[district] = (districtCount[district] || 0) + 1;
    }
  }

  // Find the district with the maximum count
  const dominantDistrict = Object.keys(districtCount).reduce(
    (a, b) => (districtCount[a] > districtCount[b] ? a : b),
    ''
  );

  console.log("Dominant District:", dominantDistrict);
  return dominantDistrict;
};

// TODO: make sure 'district' field in user_info is updated --> no need of getMostVisitedDistrict, only get 'district' value
// Function to get random restaurants based on the user's most visited district
//async function getRandomRestaurantsBasedOnUser(client, userId, numberOfRestaurants) {
const getRandomRestaurantsBasedOnUser = async (userId, numberOfRestaurants) => {
  try {

  // Find the user using Mongoose
  const user = await User.findById(userId).lean();

  // Check if the user exists and has visited restaurants
  if (!user || !user.placesVisited || user.placesVisited.length === 0) {
    return [];
   }

  const mostVisitedDistrict = await getMostVisitedDistrict(user.placesVisited);
  
  return await getRandomRestaurantsByDistrict(mostVisitedDistrict, numberOfRestaurants);
   } catch (err) {
     console.error('Error: could not retrieve random restaurants based on user', err);
     return [];
   }
}


// Helper function to get the top 10 restaurants
// Based on rankingString, Assuming more than 10 restaurants with rankingString. NOTE: should not display score in app
const getTopRestaurants = async (limit) => {
  try {
    // Fetch all restaurants with a defined rankingString
    const restaurants = await Restaurant.find({ rankingString: { $exists: true, $ne: "" } }).lean();

    // Extract, calculate score, and sort by the score
    const sortedRestaurants = restaurants
      .map((restaurant) => {
        const match = restaurant.rankingString.match(/#(\d+) of (\d+)/);
        if (match) {
          const rank = parseInt(match[1], 10); 
          const total = parseInt(match[2], 10); 
          const score = rank / total; // Lower score is better
          return { ...restaurant, score };
        }
        return null;
      })
      .filter((restaurant) => restaurant !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, limit);

    // Format the response
    return sortedRestaurants.map((restaurant) => ({
      name: restaurant.name,
      image: restaurant.mainImage || DEFAULT_MAIN_IMAGE, // Default image if none exists
      score: restaurant.rankingString,
    }));
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    throw new Error("Internal server error");
  }
};

module.exports = { getRandomRestaurantsByDistrict, getMostVisitedDistrict, getRandomRestaurantsBasedOnUser, getTopRestaurants};


//------------------------------------------------------------------------------------------------

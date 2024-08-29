const { User } = require("../models/User");
const Restaurant = require("../models/Restaurant"); // Import the Restaurant model


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

module.exports = { getRandomRestaurantsByDistrict, getMostVisitedDistrict, getRandomRestaurantsBasedOnUser};



//-----------------------------
  
// Function to get random restaurants by district
 //async function getRandomRestaurantsByDistrict(client, district, numberOfRestaurants) {
  // const getRandomRestaurantsByDistrict = async (district, numberOfRestaurants) => {
  //   try {
     
  //     // Query for matching restaurants in the specified district
  //     const matchingRestaurants = await Restaurant.find({ district: "Tel Aviv District" }).lean();
  
  //     // If requested number of restaurants is more than available, limit to available restaurants
  //     const availableSameDistrictRestaurants = matchingRestaurants.length;
  //     const numberOfSameDistrictRestaurants = Math.min(Math.ceil(0.9 * numberOfRestaurants), availableSameDistrictRestaurants);
  //     const numberOfDifferentDistrictRestaurants = Math.max(numberOfRestaurants - availableSameDistrictRestaurants, 0);
  
  //     // Efficient shuffling using Fisher-Yates algorithm
  //     for (let i = matchingRestaurants.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [matchingRestaurants[i], matchingRestaurants[j]] = [matchingRestaurants[j], matchingRestaurants[i]];
  //     }
  
  //     const sameDistrictRestaurants = matchingRestaurants.slice(0, numberOfSameDistrictRestaurants);
  
  //     // Handle if there are not enough different district restaurants available
  //     let differentDistrictRestaurants = [];
  //     if (numberOfDifferentDistrictRestaurants > 0) {
  //       differentDistrictRestaurants = await Restaurant.aggregate([
  //         { $match: { district: { $ne: district } } },
  //         { $sample: { size: numberOfDifferentDistrictRestaurants } }
  //       ]);
  //     }
  
  //     return sameDistrictRestaurants.concat(differentDistrictRestaurants);
  //   } catch (err) {
  //     console.error('Error: could not retrieve random restaurants by district', err);
  //     return [];
  //   }
  // }
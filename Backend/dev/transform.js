//const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');
const { DATABASE_NAME, COLLECTIONS } = require('../dal/constants');
const { withDatabaseConnection } = require('../dal/dal');
const Restaurant = require('../models/Restaurant');
const RestaurantReviews = require('../models/Review');

// Load environment variables
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

async function connectToMongoDB() {
  const client = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log('MongoDB connected...');
  return client;
}

async function closeMongoDBConnection(client) {
  await client.close();
  console.log('MongoDB connection closed...');
}

async function updateRestaurantScores() {
  const client = await connectToMongoDB();
  try {
    console.log('Starting restaurant scores update...');

    // Access the database and collections
    const db = client.db(DATABASE_NAME);
    const restaurantsCollection = db.collection(COLLECTIONS.RESTAURANTS);
    const reviewsCollection = db.collection(COLLECTIONS.RESTAURANTS_REVIEW);

    // Get all restaurants
    const restaurants = await restaurantsCollection.find().toArray();
    console.log(`Found ${restaurants.length} restaurants`);

    for (const restaurant of restaurants) {
      const restaurantId = restaurant._id.toString();
      console.log(`Processing restaurant ${restaurantId}`);

      // Get reviews for the restaurant
      const reviews = await reviewsCollection.find({ restaurantId }).toArray();
      console.log(`Found ${reviews.length} reviews for restaurant ${restaurantId}`);

      // Calculate averages
      const reviewCount = reviews.length;

      const scores = {
        foodQuality: 3,
        cleanliness: 3,
        serviceQuality: 3,
        atmosphereQuality: 3
      };

      if (reviewCount > 0) {
        const totals = { foodQuality: 0, cleanliness: 0, serviceQuality: 0, atmosphereQuality: 0 };

        for (const review of reviews) {
          totals.foodQuality += review.foodScore;
          totals.cleanliness += review.cleanlinessScore;
          totals.serviceQuality += review.serviceScore;
          totals.atmosphereQuality += review.atmosphereScore;
        }

        scores.foodQuality = totals.foodQuality / reviewCount;
        scores.cleanliness = totals.cleanliness / reviewCount;
        scores.serviceQuality = totals.serviceQuality / reviewCount;
        scores.atmosphereQuality = totals.atmosphereQuality / reviewCount;
      }

      // Update the restaurant document
      await restaurantsCollection.updateOne(
        { _id: restaurant._id },
        { $set: { restaurantScores: scores } }
      );

      console.log(`Updated scores for restaurant ${restaurantId}`);
    }

    console.log('Restaurant scores update completed');
  } catch (error) {
    console.error('Error updating restaurant scores:', error);
  } finally {
    await closeMongoDBConnection(client);
  }
}


// async function main() {
//   try {
//     await updateRestaurantScores();
//   } catch (error) {
//     console.error('Error during restaurant scores update:', error);
//   }
// }

// main();
///----------------------------------------------


// Function to get the first two sentences from a description
const getFirstTwoSentences = (description) => {
    if (!description) return 'N/A';
    
    const sentences = description.split('.');
    return sentences.length > 2 ? sentences.slice(0, 2).join('.') + '.' : description;
};
  
  // Function to format opening hours
  const formatOpeningHours = (weekRanges) => {
    if (!weekRanges) return 'N/A';
  
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let openingHours = '';
    let prevHours = '';
    let prevDays = '';
  
    for (let i = 0; i < weekRanges.length; i++) {
      const range = weekRanges[i];
      if (range && range.length > 0) {
        const { openHours, closeHours } = range[0];
        const day = days[i];
        const currentHours = `${openHours} - ${closeHours}`;
  
        if (prevHours === currentHours) {
          prevDays = prevDays.includes('-') ? prevDays.split(' - ')[0] + ` - ${day}` : `${prevDays} - ${day}`;
        } else {
          if (prevDays) {
            openingHours += `${prevDays}: ${prevHours}, `;
          }
          prevHours = currentHours;
          prevDays = day;
        }
      }
    }
  
    if (prevDays) {
      openingHours += `${prevDays}: ${prevHours}`;
    }
  
    return openingHours.replace(/^,|,$/g, '').trim();
  };
  
  const hasStringInArray = (array, searchString) => {
    return array.some(item => item.toLowerCase().includes(searchString.toLowerCase()));
  };
  
  const isVeganFriendly = (cuisines) => hasStringInArray(cuisines, 'vegan');
  
  const isWheelchairAccessible = (features) =>  hasStringInArray(features, 'wheelchair accessible');
  
  const isGlutenFree = (cuisines) => hasStringInArray(cuisines, 'gluten free');
  
  const cuisineHierarchy = {
    'Italian': ['Pizza', 'Pasta', 'Sicilian', 'Calabrian', 'Neapolitan', 'Ligurian', 'Tuscan', 'Venetian', 'Milanese', 'Roman', 'Northern-Italian', 'Central-Italian', 'Southern-Italian'],
    'Cafe': ['Cafe'],
    'Bar': ['Pub', 'Wine Bar'],
    'Israeli': ['Middle Eastern'],
    'Asian': ['Sushi', 'Japanese', 'Chinese', 'Korean', 'Thai', 'Vietnamese', 'Indian', 'Japanese Fusion', 'Vietnamese'],
    'European': ['French', 'Spanish', 'German', 'Romanian', 'Greek', 'Swedish', 'Belgian', 'Ukrainian', 'Emilian', 'French', 'Central European', 'British', 'Scottish', 'Austrian', 'Romanian', 'Hungarian', 'Spanish', 'German', 'Irish'],
    'Middle Eastern': ['Lebanese', 'Turkish', 'Israeli', 'Arabic'],
    'South American': ['Brazilian'],
    'Mediterranean': ['Mediterranean'],
    'African': ['Moroccan', 'South African'],
    'Mexican': ['Mexican'],
    'Oceanic': ['Hawaiian', 'Australian'],
    'Russian': ['Russian'],
    'Indigenous': ['Indigenous'],
    'Seafood': ['Seafood']
  };
  
  const getDominantCuisine = (cuisines) => {
    if (!cuisines || cuisines.length === 0) return 'N/A';
  
    const dominantCuisines = new Set();
  
    cuisines.forEach(cuisine => {
      for (const [general, subcategories] of Object.entries(cuisineHierarchy)) {
        if (general.toLowerCase() === cuisine.toLowerCase() || subcategories.map(sub => sub.toLowerCase()).includes(cuisine.toLowerCase())) {
          dominantCuisines.add(general);
          break;
        }
      }
    });
  
    if (dominantCuisines.size === 1) {
      return Array.from(dominantCuisines)[0];
    }
  
    return cuisines[0];
  };
  
  //async function transformAndUploadData(client) {
  const transformAndUploadData = async (client) => {
    try {
      const db = client.db(DATABASE_NAME);
      const originalCollection = db.collection(COLLECTIONS.RESTAURANTS_RAW);
      const transformedCollection = db.collection(COLLECTIONS.RESTAURANTS);
  
      const restaurants = await originalCollection.find().toArray();
  
      const transformedData = restaurants.map(restaurant => {
        const fullLocation = `${restaurant.addressObj?.street1 || 'N/A'}, ${restaurant.addressObj?.city || 'N/A'}`;
        const openingHours = restaurant.hours ? formatOpeningHours(restaurant.hours.weekRanges) : 'N/A';
        const district = restaurant.locationString ? restaurant.locationString.split(', ')[1] || 'N/A' : 'N/A';
  
        return {
          name: restaurant.name || 'N/A',
          rating: restaurant.rating || 'N/A',
          mainImage: restaurant.image || 'N/A',
          city: restaurant.addressObj?.city || 'N/A',
          fullLocation: fullLocation,
          district: district,
          priceLevel: restaurant.priceLevel || 'N/A',
          images: restaurant.photos || [],
          menuLink: restaurant.menuWebUrl || 'N/A',
          description: getFirstTwoSentences(restaurant.description),
          openingHours: openingHours,
          rankingString: restaurant.rankingString || 'N/A',
          type: getDominantCuisine(restaurant.cuisines),
          isVeganFriendly: isVeganFriendly(restaurant.cuisines),
          isWheelchairAccessible: isWheelchairAccessible(restaurant.features),
          isGlutenFree: isGlutenFree(restaurant.cuisines)
        };
      });
  
      const result = await transformedCollection.insertMany(transformedData);
      console.log(`${result.insertedCount} documents inserted into restaurants collection`);
  
      return transformedData;
    } catch (err) {
      console.error('Error: could not transform and upload data', err);
    }
  }


  async function addTimestampsToExistingDocuments(client) {
    const db = client.db(DATABASE_NAME); 
    const collection = db.collection(COLLECTIONS.RESTAURANTS); 
  
    const result = await collection.updateMany(
      {}, // Empty filter to select all documents
      {
        $set: {
         // createdAt: true,
          updatedAt: true
        }
      }
    );

    console.log(`${result.modifiedCount} documents were updated with createdAt and updatedAt fields.`);
  }


  async function setCreatedAtToSpecificDate(client) {
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTIONS.RESTAURANTS); 
    // Define the specific date for createdAt (June 1st, 2024)
    const specificDate = new Date('2024-06-01T00:00:00Z');
  
    // Update all documents by setting 'createdAt' to the specific date
    const result = await collection.updateMany(
      { createdAt: { $exists: false } }, // Only update documents where 'createdAt' does not exist
      { $set: { createdAt: specificDate } }
    );
  
    console.log(`${result.modifiedCount} documents were updated with createdAt set to June 1st, 2024.`);
  }
  
  
  const updateMenuLinks = withDatabaseConnection(async (client) => {
    const database = client.db(DATABASE_NAME);
    const restaurantsCollection = database.collection(COLLECTIONS.RESTAURANTS);
    const restaurantsRawCollection = database.collection(COLLECTIONS.RESTAURANTS_RAW);
  
    // Find all documents with "N/A" in the "menuLink" field
    const restaurantsWithNA = await restaurantsCollection.find({ menuLink: 'N/A' }).toArray();
  
    for (const restaurant of restaurantsWithNA) {
      const { name } = restaurant;
  
      // Find matching records in the "restaurants_raw" collection
      const matchingRecords = await restaurantsRawCollection.find({ name }).toArray();
  
      if (matchingRecords.length === 1) {
        const { website } = matchingRecords[0];
  
        // Only update if the website value is not null or undefined
        if (website) {
          await restaurantsCollection.updateOne(
            { _id: restaurant._id },
            { $set: { menuLink: website } }
          );
  
          console.log(`Updated menuLink for ${name} to ${website}`);
        } else {
          console.log(`Skipping update for ${name} due to null or undefined website`);
        }
      } else {
        console.log(`Skipping ${name} due to ${matchingRecords.length} matching records`);
      }
    }
  });
  
  const resetMenuLinks = withDatabaseConnection(async (client) => {
    const database = client.db(DATABASE_NAME);
    const restaurantsCollection = database.collection(COLLECTIONS.RESTAURANTS);
  
    // Find all documents with null value in the "menuLink" field
    const result = await restaurantsCollection.updateMany(
      { menuLink: null },
      { $set: { menuLink: 'N/A' } }
    );
  
    console.log(`Updated ${result.modifiedCount} documents where menuLink was null.`);
  });


  module.exports = { transformAndUploadData };
  

  
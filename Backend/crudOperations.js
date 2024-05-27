require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    //Testing the CRUD operations:
    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

/**
 * Print the names of all available databases
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 */
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

/**
 * Create a new restaurants listing
 * param {MongoClient} client A MongoClient that is connected to a cluster with the dishcover_db database
 * param {Object} newListing The new listing to be added
 */
async function createListing(client, newListing) {
  const result = await client
    .db("dishcover_db")
    .collection("restaurants")
    .insertOne(newListing);

  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

/**
 * Create multiple Airbnb listings
 * param {MongoClient} client A MongoClient that is connected to a cluster with the dishcover_db database
 * param {Object[]} newListings The new listings to be added
 */
async function createMultipleListings(client, newListings) {
  const result = await client
    .db("dishcover_db")
    .collection("restaurants")
    .insertMany(newListings);

  console.log(
    `${result.insertedCount} new listing(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
}

/**
 * Print an restaurant listing with the given name
 * Note: If more than one listing has the same name, only the first listing the database finds will be printed.
 * param {MongoClient} client A MongoClient that is connected to a cluster with the dishcover_db database
 * param {String} nameOfListing The name of the listing you want to find
 */
async function findOneListingByName(client, nameOfListing) {
  const result = await client
    .db("dishcover_db")
    .collection("restaurants")
    .findOne({ name: nameOfListing });

  if (result) {
    console.log(
      `Found a listing in the collection with the name '${nameOfListing}':`
    );
    console.log(result);
  } else {
    console.log(`No listings found with the name '${nameOfListing}'`);
  }
}

/**
 * Update an restaurant listing with the given name
 * Note: If more than one listing has the same name, only the first listing the database finds will be updated.
 * param {MongoClient} client A MongoClient that is connected to a cluster with the dishcover_db database
 * param {string} nameOfListing The name of the listing you want to update
 * param {object} updatedListing An object containing all of the properties to be updated for the given listing
 */
async function updateListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db("dishcover_db")
    .collection("restaurants")
    .updateOne({ name: nameOfListing }, { $set: updatedListing });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

/**
 * Upsert an restaurant listing with the given name.
 * If a listing with the given name exists, it will be updated.
 * If a listing with the given name does not exist, it will be inserted.
 * Note: If more than one listing has the same name, only the first listing the database finds will be updated.
 * Note: For educational purposes, we have split the update and upsert functionality into separate functions.
 *       Another option is to have a single function where a boolean param indicates if the update should be an upsert.
 * param {MongoClient} client A MongoClient that is connected to a cluster with the dishcover_db database
 * param {string} nameOfListing The name of the listing you want to upsert
 * param {object} updatedListing An object containing all of the properties to be upserted for the given listing
 */
async function upsertListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db("dishcover_db")
    .collection("restaurants")
    .updateOne(
      { name: nameOfListing },
      { $set: updatedListing },
      { upsert: true }
    );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);

  if (result.upsertedCount > 0) {
    console.log(
      `One document was inserted with the id ${result.upsertedId._id}`
    );
  } else {
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
}

/**
 * Delete an restaurant listing with the given name.
 * Note: If more than one listing has the same name, only the first listing the database finds will be deleted.
 * param {MongoClient} client A MongoClient that is connected to a cluster with the dishcover_db database
 * param {string} nameOfListing The name of the listing you want to delete
 */
async function deleteListingByName(client, nameOfListing) {
  const result = await client
    .db("dishcover_db")
    .collection("restaurants")
    .deleteOne({ name: nameOfListing });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

/**
 * Delete all listings that were last scraped prior to the given date
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the dishcover_db database
 * @param {Date} date The date to check the last_scraped property against
 */
async function deleteListingsScrapedBeforeDate(client, date) {
  const result = await client
    .db("dishcover_db")
    .collection("restaurants")
    .deleteMany({ last_scraped: { $lt: date } });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

const { MongoClient } = require('mongodb');
const { DATABASE_NAME } = require('./constants'); 

const mongoURI = 'mongodb+srv://InbarCohen:ADAHLl0aJRMyy7ZL@cluster0.ulirpbk.mongodb.net/'; //TODO: remove and put in dotenv

async function connectToMongoDB() {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('MongoDB connected...');
  return client;
}

async function closeMongoDBConnection(client) {
  await client.close();
  console.log('MongoDB connection closed...');
}

/**
 * Decorator function to manage MongoDB connections for a given function.
 * @param {Function} fn - The function to decorate.
 * @returns {Function} A new function with database connection management.
 */
function withDatabaseConnection(fn) {
  return async function (...args) {
    const client = await connectToMongoDB();
    try {
      // Pass the client to the decorated function
      await fn(client, ...args);
    } finally {
      await closeMongoDBConnection(client);
    }
  };
}

module.exports = { connectToMongoDB, closeMongoDBConnection, withDatabaseConnection };







//'mongodb://localhost:27017/'
//'mongodb://localhost:27017/my_database'; 
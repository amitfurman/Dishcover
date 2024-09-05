const { MongoClient } = require("mongodb");
const { DATABASE_NAME } = require("./constants");

async function connectToMongoDB() {
  const client = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log("MongoDB connected...");
  return client;
}

async function closeMongoDBConnection(client) {
  await client.close();
  console.log("MongoDB connection closed...");
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

module.exports = {
  connectToMongoDB,
  closeMongoDBConnection,
  withDatabaseConnection,
};

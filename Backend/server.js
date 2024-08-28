// Import the Express module
const express = require("express");
const app = express();

//const routes = require("./routes");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");

app.use(express.json());

//app.use("/api", routes);
app.use("/api/users", userRoutes); // Prefix routes
//app.use("/api/restaurants", restaurantRoutes); // Prefix routes

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// // Define API routes
// app.get('/api/transform', async (req, res) => {
//   const client = await connectToMongoDB();
//   const data = await transformAndUploadData(client);
//   await closeMongoDBConnection(client);
//   res.json(data);
// });

// app.get('/api/random-restaurants', async (req, res) => {
//   const { district, count } = req.query;
//   const client = await connectToMongoDB();
//   const data = await getRandomRestaurantsByDistrict(client, district, parseInt(count));
//   await closeMongoDBConnection(client);
//   res.json(data);
// });

// app.get('/api/user-random-restaurants', async (req, res) => {
//   const { userId } = req.query;
//   const client = await connectToMongoDB();
//   const data = await getRandomRestaurantsBasedOnUser(client, userId, 50);
//   await closeMongoDBConnection(client);
//   res.json(data);
// });
// // Usage
// async function main() {
//   const client = await connectToMongoDB();
//   //await transformAndUploadData(client);
//   await closeMongoDBConnection(client);
// }

// main();

// // Define a route handler for the default home page
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

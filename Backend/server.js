const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ApifyClient } = require("apify-client"); // Import ApifyClient from apify-client package

const mongoUrl = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const MY_APIFY_TOKEN = process.env.MY_APIFY_TOKEN;

// Import the schemas/models
require("./UserDetails");
require("./RestaurantsDetails");

const User = mongoose.model("UserInfo");
const Restaurants = mongoose.model("restaurants");

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Defining a route for handling client communication
app.get("/", (req, res) => {
  res.send({ statuse: "Started" });
});

app.get("/checkUserByName", async (req, res) => {
  const { name } = req.query;

  try {
    const oldUserWithSameName = await User.findOne({ name: name });
    if (oldUserWithSameName) {
      return res.status(200).json({
        exists: true,
        message: "User already exists with this name.",
      });
    } else {
      return res.status(200).json({
        exists: false,
        message: "Name is available.",
      });
    }
  } catch (error) {
    console.error("Error checking name:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/checkUserByEmail", async (req, res) => {
  const { email } = req.query;

  try {
    const oldUserWithSameEmail = await User.findOne({ email: email });
    if (oldUserWithSameEmail) {
      return res.status(200).json({
        exists: true,
        message: "User already exists with this email.",
      });
    }
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "User created successfully" });
  } catch (e) {
    res.send({ status: "error", data: e.message });
  }
});

app.post("/signin", async (req, res) => {
  const { id, password } = req.body;
  const oldUser = await User.findOne({ $or: [{ email: id }, { name: id }] });

  if (!oldUser) {
    return res.send({ status: "error", data: "User doesn't exists." });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign(
      { id: oldUser._id, email: oldUser.email },
      JWT_SECRET
    );
    if (res.status(201)) {
      return res.send({ status: "ok", data: token });
    } else {
      return res.send({ status: "error", data: "Error" });
    }
  } else {
    return res.send({ status: "error", data: "Invalid Password" });
  }
});

app.post("/placesUserVisit", async (req, res) => {
  const { username, placesVisited } = req.body;
  console.log(`Received request for restaurants: ${placesVisited}`);
  console.log(`UserId: ${username}`);

  try {
    // Save placesVisited to user collection
    const updatedUser = await User.findOneAndUpdate(
      { name: username },
      { $addToSet: { placesVisited: { $each: placesVisited } } }, // Use $addToSet to ensure uniqueness
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ status: "error", data: "User not found" });
    }
    const restaurantsDataFromDB = await Restaurants.find(
      {
        name: { $in: placesVisited },
      },
      { name: 1, mainImage: 1 }
    );

    /////////////////////////////////////////////////
    const foundRestaurants = restaurantsDataFromDB.map(
      (restaurant) => restaurant.name
    );
    console.log("foundRestaurants", foundRestaurants);

    const missingRestaurants = restaurantsDataFromDB.filter(
      (name) => !foundRestaurants.includes(name)
    );
    console.log("missingRestaurants", missingRestaurants);
    /////////////////////////////////////////////////

    if (restaurantsDataFromDB.length > 0) {
      console.log(
        `Returning data for restaurants: ${restaurantsDataFromDB
          .map((restaurant) => restaurant.name)
          .join(", ")}`
      );
      res.send({ status: "ok", data: restaurantsDataFromDB });
    } else {
      res.status(404).send({
        status: "error",
        data: "No listings found with the given names.",
      });
    }
  } catch (e) {
    res.status(500).send({
      status: "error",
      data: e.message,
    });
  }
});

app.post("/placesUserWantToVisit", async (req, res) => {
  const { username, placesToVisit } = req.body;
  console.log(`Received request for restaurants: ${placesToVisit}`);
  console.log(`UserId: ${username}`);

  try {
    // Save placesToVisit to user collection
    const updatedUser = await User.findOneAndUpdate(
      { name: username },
      { $addToSet: { placesToVisit: { $each: placesToVisit } } }, // Use $addToSet to ensure uniqueness
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ status: "error", data: "User not found" });
    }
    res.send({ status: "ok" });
  } catch (e) {
    res.status(500).send({
      status: "error",
      data: e.message,
    });
  }
});
/*
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

app.get("/image", async (req, res) => {
  const { restaurantNames } = req.query;
  console.log(`Received request for restaurants: ${restaurantNames}`);

  try {
    const restaurantsDataFromDB = await Restaurants.find(
      {
        name: { $in: restaurantNames },
      },
      { name: 1, image: 1 }
    );

    const foundRestaurants = restaurantsDataFromDB.map(
      (restaurant) => restaurant.name
    );
    console.log("foundRestaurants:", foundRestaurants);

    const missingRestaurants = restaurantNames.filter(
      (name) => !foundRestaurants.includes(name)
    );
    console.log("missingRestaurants:", missingRestaurants);

    const missingRestaurantsData = [];

    // Initialize the ApifyClient with your Apify API token
    const client = new ApifyClient({
      token: MY_APIFY_TOKEN,
    });

    // Function to search TripAdvisor for the restaurant URL using Puppeteer
    const findTripAdvisorURL = async (restaurantName) => {
      let browser;
      try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        const searchUrl = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(
          restaurantName
        )}`;
        console.log(`Searching for ${restaurantName} at ${searchUrl}`);
        await page.goto(searchUrl, { waitUntil: "networkidle2" });

        // Log the HTML of the search results for debugging
        const html = await page.content();
        console.log(`HTML content for ${restaurantName}:`, html);

        // Extract the URL of the first search result
        const firstResult = await page.evaluate(() => {
          const link = document.querySelector("a.result-title"); // Update this selector based on the actual HTML structure
          return link ? link.href : null;
        });

        await browser.close();
        console.log(`Found URL for ${restaurantName}: ${firstResult}`);
        return firstResult;
      } catch (error) {
        if (browser) {
          await browser.close();
        }
        console.error(
          `Error searching for ${restaurantName}: ${error.message}`
        );
        return null;
      }
    };

    // Fetch data for missing restaurants from the API
    await Promise.all(
      missingRestaurants.map(async (name) => {
        try {
          const tripAdvisorUrl = await findTripAdvisorURL(name);
          if (!tripAdvisorUrl) {
            console.log(`No URL found for ${name}`);
            return;
          }

          const input = {
            currency: "ILS",
            includeDescription: false,
            includeAiReviewsSummary: false,
            includeAttractions: false,
            includeHotels: false,
            includePriceOffers: true,
            includeRestaurants: true,
            includeTags: false,
            includeVacationRentals: false,
            language: "en",
            maxItemsPerQuery: 1,
            startUrls: [
              {
                url: tripAdvisorUrl,
              },
            ],
            checkInDate: "",
            checkOutDate: "",
          };

          const run = await client.actor("maxcopell/tripadvisor").call(input);
          console.log(`Run ID for ${name}: ${run.id}`);

          const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

          console.log(`Items for ${name}:`, items);
          if (items && items.length > 0) {
            // Assuming the first item contains the restaurant data
            const restaurantData = items[0];

            // Extract the image URL from the restaurant data
            const id = restaurantData.id;
            const imageUrl = restaurantData.image;
            missingRestaurantsData.push({ name, image: imageUrl, id: id });
            console.log(`Data for ${name}:`, { name, image: imageUrl, id: id });
          }
        } catch (error) {
          console.error(
            `Error fetching data for restaurant ${name}: ${error.message}`
          );
        }
      })
    );

    const allRestaurantsData = [
      ...restaurantsDataFromDB,
      ...missingRestaurantsData,
    ];
    console.log("allRestaurantsData:", allRestaurantsData);

    if (allRestaurantsData.length > 0) {
      console.log(
        `Returning data for restaurants: ${allRestaurantsData
          .map((restaurant) => restaurant.name)
          .join(", ")}`
      );
      res.send({ status: "ok", data: allRestaurantsData });
    } else {
      res.send({
        status: "error",
        data: "No listings found with the given names.",
      });
    }
  } catch (e) {
    console.error(`Error in /image endpoint: ${e.message}`);
    res.send({
      status: "error",
      data: e.message,
    });
  }
});
*/

/*
//14/06
app.get("/image", async (req, res) => {
  const { restaurantNames } = req.query;
  console.log(`Received request for restaurants: ${restaurantNames}`);

  try {
    const restaurantsDataFromDB = await Restaurants.find(
      {
        name: { $in: restaurantNames },
      },
      { name: 1, image: 1 }
    );

    const foundRestaurants = restaurantsDataFromDB.map(
      (restaurant) => restaurant.name
    );
    console.log("foundRestaurants", foundRestaurants);

    const missingRestaurants = restaurantNames.filter(
      (name) => !foundRestaurants.includes(name)
    );
    console.log("missingRestaurants", missingRestaurants);

    const missingRestaurantsData = [];

    // Initialize the ApifyClient with your Apify API token
    const client = new ApifyClient({
      token: MY_APIFY_TOKEN,
    });

    // Fetch data for missing restaurants from the API
    await Promise.all(
      missingRestaurants.map(async (name) => {
        try {
          const input = {
            currency: "ILS",
            includeDescription: false,
            includeAiReviewsSummary: false,
            includeAttractions: false,
            includeHotels: false,
            includePriceOffers: true,
            includeRestaurants: true,
            includeTags: false,
            includeVacationRentals: false,
            language: "en",
            maxItemsPerQuery: 1,
            startUrls: [
              {
                url: "https://www.tripadvisor.com/Restaurant_Review-g293984-d4071520-Reviews-Night_Kitchen_TLV-Tel_Aviv_Tel_Aviv_District.html",
              },
            ],
            checkInDate: "",
            checkOutDate: "",
          };

          const run = await client.actor("maxcopell/tripadvisor").call(input);
          const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

          console.log("items", items);
          if (items && items.length > 0) {
            // Assuming the first item contains the restaurant data
            console.log("items[0]", items[0]);
            const restaurantData = items[0];

            // Extract the image URL from the restaurant data
            const id = restaurantData.id;
            const imageUrl = restaurantData.image;
            missingRestaurantsData.push({ name, image: imageUrl, id: id });
            console.log("missingRestaurantsData", missingRestaurantsData);
          }
        } catch (error) {
          console.error(
            `Error fetching data for restaurant ${name}: ${error.message}`
          );
        }
      })
    );

    const allRestaurantsData = [
      ...restaurantsDataFromDB,
      ...missingRestaurantsData,
    ];
    console.log("allRestaurantsData", allRestaurantsData);

    if (allRestaurantsData.length > 0) {
      console.log(
        `Returning data for restaurants: ${allRestaurantsData
          .map((restaurant) => restaurant.name)
          .join(", ")}`
      );
      res.send({ status: "ok", data: allRestaurantsData });
    } else {
      res.send({
        status: "error",
        data: "No listings found with the given names.",
      });
    }
  } catch (e) {
    res.send({
      status: "error",
      data: e.message,
    });
  }
});
*/

// Starting the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

const mongoose = require("mongoose");

const restaurantsDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    image: { type: String, unique: true },
  },
  {
    collection: "restaurants", // Specify the collection name as "restaurants"
  }
);

module.exports = mongoose.model("restaurants", restaurantsDetailsSchema);

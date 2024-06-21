const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  foodScore: { type: Number, required: true, min: 0, max: 5 },
  cleanlinessScore: { type: Number, required: true, min: 0, max: 5 },
  serviceScore: { type: Number, required: true, min: 0, max: 5 },
  atmosphereScore: { type: Number, required: true, min: 0, max: 5 },
  comments: { type: String, required: true },
});

const restaurantReviewsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    reviews: [reviewSchema],
  },
  {
    collection: "restaurants_reviews", // Specify the collection name as "userinfo"
  }
);

module.exports = mongoose.model("restaurants_reviews", restaurantReviewsSchema);

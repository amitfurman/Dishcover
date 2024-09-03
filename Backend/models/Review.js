const mongoose = require("mongoose");
const { COLLECTIONS } = require("../dal/constants");

const reviewSchema = new mongoose.Schema({
  //customerName: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  foodScore: { type: Number, required: true, min: 0, max: 5 },
  cleanlinessScore: { type: Number, required: true, min: 0, max: 5 },
  serviceScore: { type: Number, required: true, min: 0, max: 5 },
  atmosphereScore: { type: Number, required: true, min: 0, max: 5 },
  comments: { type: String, required: true },
});

const restaurantReviewsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, unique: true },
    reviews: [reviewSchema],
  },
  {
    collection: COLLECTIONS.RESTAURANTS_REVIEW,
    timestamps: true,
  }
);

module.exports = mongoose.model("restaurants_reviews", restaurantReviewsSchema);

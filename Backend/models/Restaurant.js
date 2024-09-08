const mongoose = require('mongoose');
const { COLLECTIONS } = require('../dal/constants');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  mainImage: { type: String, required: true },
  city: { type: String, required: true },
  fullLocation: { type: String, required: true },
  district: { type: String, required: true },
  priceLevel: { type: String, required: true },
  images: [String],
  menuLink: { type: String, required: true },
  description: { type: String, required: true },
  openingHours: { type: String, required: true },
  rankingString: { type: String, required: false }, 
  type: { type: String, required: true },
  isVeganFriendly: { type: Boolean, default: false },
  isWheelchairAccessible: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  restaurantScores: {
    foodQuality: { type: Number, default: 3 },
    cleanliness: { type: Number, default: 3 },
    serviceQuality: { type: Number, default: 3 },
    atmosphereQuality: { type: Number, default: 3 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true, 
  collection: COLLECTIONS.RESTAURANTS 
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;

const mongoose = require("mongoose");
const { COLLECTIONS } = require("../dal/constants");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    placesVisited: [
      {
        type: String,
      },
    ],
    placesToVisit: [
      {
        type: String,
      },
    ],
    district: { type: String }, 
  },
  {
    collection: COLLECTIONS.USER_INFO, // Specify the collection name as "userinfo"
    timestamps: true,
  }
);

const UserProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    district: String,
    age: Number,
    gender: String,
    familyStatus: String,
    accessibilityFeatures: {
      vegan: Number,
      glutenFree: Number,
      wheelchair: Number,
    },
    cuisinesPriority: String,
    scores: {
      vegan: Number,
      glutenFree: Number,
      wheelchair: Number,
    },
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt
  }
);

module.exports = {
  User: mongoose.model("UserInfo", UserSchema),
  UserProfile: mongoose.model("UserProfile", UserProfileSchema),
};


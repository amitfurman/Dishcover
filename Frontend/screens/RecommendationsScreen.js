import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS } from "../constants";
import RecommendationsCard from "../components/RecommendationsCard";
import { restaurants as restaurantsArray } from "../data";

const RecommendationsScreen = () => {
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);

  // Function to handle the selection of a restaurant
  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurants((prevSelected) => {
      if (prevSelected.some((item) => item.name === restaurant.name)) {
        // If the restaurant is already selected, remove it
        return prevSelected.filter((item) => item.name !== restaurant.name);
      }
      // Otherwise, add it to the selected list
      return [...prevSelected, restaurant.name];
    });
  };

  // Function to handle the submit button press
  const handleSubmit = async () => {
    console.log(selectedRestaurants);
    try {
      const response = await fetch(
        "https://your-backend-url.com/update-wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ restaurants: selectedRestaurants }),
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Your wishlist has been updated.");
      } else {
        Alert.alert("Error", "Failed to update your wishlist.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>Restaurant Recommendations</Text>
      </View>
      <View style={styles.cardsContainer}>
        {restaurantsArray.map((item, index) => (
          <RecommendationsCard
            key={index}
            name={item.name}
            image={item.image}
            type={item.type}
            city={item.city}
            matchingPercentage={item.matchingPercentage}
            onHeartPress={() => handleSelectRestaurant(item)} // Pass the handler to the card
          />
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update Wishlist</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  titleTextContainer: {
    backgroundColor: COLORS.blue,
    alignItems: "center",
    fontFamily: "Poppins_700Bold",
    paddingTop: 70,
  },
  titleText: {
    fontSize: 25,
    color: COLORS.white,
    paddingBottom: 20,
  },
  cardsContainer: {},
  submitButton: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 5,
    margin: 30,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: "Poppins_700Bold",
  },
});

export default RecommendationsScreen;

import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { COLORS, url } from "../constants";
import RecommendationsCard from "../components/RecommendationsCard";
import WishlistCardBack from "../components/WishlistCardBack";
import { restaurants } from "../data";

const RecommendationsScreen = () => {
  //const route = useRoute();
  //const { username } = route.params;
  //const username = "Eden";
  const navigation = useNavigation();

  const [restaurantsArray, setRestaurantArray] = useState(restaurants);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

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

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${url}/api/users/updatePlacesUserWantToVisit`,
        {
          username: username,
          placesToVisit: [...new Set(selectedRestaurants)],
        }
      );
      if (response.data && response.data.status === "ok") {
        navigation.navigate("MainScreen", {
          username: username,
        });
      } else {
        console.error("Error from server:", response.data);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleClickOnCard = (item) => {
    const details = {
      name: item.name,
      rating: item.rating,
      location: item.city,
      priceLevel: item.priceLevel,
      images: item.images,
      menuLink: item.menuLink,
      description: item.description,
      openingHours: item.openingHours,
      rankingString: item.rankingString,
      type: item.type,
    };
    setSelectedCard(details);
    setCardModalVisible(true);
  };

  const closeCardModal = () => {
    setCardModalVisible(false);
    setSelectedCard(null);
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
            onCardPress={() => handleClickOnCard(item)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update Wishlist</Text>
      </TouchableOpacity>
      <WishlistCardBack
        visible={isCardModalVisible}
        onClose={closeCardModal}
        details={selectedCard}
      />
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

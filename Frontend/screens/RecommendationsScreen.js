import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { COLORS, url } from "../constants";
import RecommendationsCard from "../components/RecommendationsCard";
import WishlistCardBack from "../components/WishlistCardBack";

const RecommendationsScreen = () => {
  const route = useRoute();
  const {
    userId,
    userName,
    selectedDistrict,
    selectedTypes,
    selectedBudget,
    selectedAtmosphere,
    isVegan,
    isGlutenFree,
    isWheelchairAccessible,
  } = route.params;
  const navigation = useNavigation();

  const [restaurantsArray, setRestaurantsArray] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {
      userId: userId,
      selectedDistrict: selectedDistrict,
      selectedTypes: selectedTypes,
      selectedBudget: selectedBudget,
      selectedAtmosphere: selectedAtmosphere,
      isVegan: isVegan,
      isGlutenFree: isGlutenFree,
      isWheelchairAccessible: isWheelchairAccessible,
    };

    axios
      .get(`${url}/api/users/restaurantsRecommendations`, { params })
      .then((response) => {
        // Replace NaN with null or omit it
        const dataString = response.data
          .replace(/NaN/g, "null") // Replace NaN with null
          .replace(/"NaN"/g, '"null"'); // Replace "NaN" strings with "null"

        // If response.data is a string, parse it
        let data;
        try {
          data = JSON.parse(dataString);
        } catch (e) {
          console.error("Error parsing JSON:", e);
          return;
        }

        console.log(data);
        if (Array.isArray(data)) {
          setRestaurantsArray(data);
        } else {
          console.error("Unexpected data format:", data);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("API request error:", error);
        setLoading(false);
      });
  }, [
    userId,
    selectedDistrict,
    selectedTypes,
    selectedBudget,
    selectedAtmosphere,
    isVegan,
    isGlutenFree,
    isWheelchairAccessible,
  ]);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurants((prevSelected) => {
      if (prevSelected.some((item) => item._id === restaurant._id)) {
        return prevSelected.filter((item) => item._id !== restaurant._id);
      }
      return [...prevSelected, restaurant];
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${url}/api/users/updatePlacesUserWantToVisit`,
        {
          userName: userName,
          placesToVisit: [...new Set(selectedRestaurants.map((r) => r.name))],
        }
      );
      if (response.data && response.data.status === "ok") {
        navigation.navigate("BottomTabs", {
          userId: userId,
          userName: userName,
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.pink} />
        <Text style={styles.loadingText}>
          Collecting the best options for you...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>Restaurant Recommendations</Text>
      </View>
      <View style={styles.cardsContainer}>
        {restaurantsArray
          .sort((a, b) => b.score - a.score) // Sort by score from high to low
          .map((item) => (
            <RecommendationsCard
              key={item._id}
              name={item.name}
              image={item.mainImage}
              type={item.type}
              city={item.city}
              matchingPercentage={item.score}
              onHeartPress={() => handleSelectRestaurant(item)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.beige,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.pink,
    marginTop: 15,
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

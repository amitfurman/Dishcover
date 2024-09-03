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
    axios
      .get(`${url}/api/user/restaurantsRecommendations`, {
        params: {
          userId,
          selectedDistrict,
          selectedTypes,
          selectedBudget,
          selectedAtmosphere,
          isVegan,
          isGlutenFree,
          isWheelchairAccessible,
        },
      })
      .then((response) => {
        setRestaurantsArray(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error.message);
        Alert.alert(
          "Error",
          "Could not retrieve recommendations. Please try again later."
        );
        setLoading(false);
      });
  }, []);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurants((prevSelected) => {
      if (prevSelected.some((item) => item.name === restaurant.name)) {
        return prevSelected.filter((item) => item.name !== restaurant.name);
      }
      return [...prevSelected, restaurant.name];
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${url}/api/users/updatePlacesUserWantToVisit`,
        {
          userName: userName,
          placesToVisit: [...new Set(selectedRestaurants)],
        }
      );
      if (response.data && response.data.status === "ok") {
        navigation.navigate("MainScreen", {
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
        <ActivityIndicator size="large" color={COLORS.blue} />
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
        {restaurantsArray.map((item, index) => (
          <RecommendationsCard
            key={index}
            name={item.name}
            image={item.image}
            type={item.type}
            city={item.city}
            matchingPercentage={item.matchingPercentage}
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
    color: COLORS.blue,
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

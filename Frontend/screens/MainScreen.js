import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import TopRatedRestaurantCard from "../components/TopRatedRestaurantCard";
import VisitedRestaurantCard from "../components/VisitedRestaurantCard";
import { url, COLORS } from "../constants";
import axios from "axios";

const top10Restaurants = [
  {
    name: "Restaurant 1",
    image: "https://via.placeholder.com/150",
    score: 9.5,
  },
  {
    name: "Restaurant 2",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 3",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 4",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 5",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 6",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 7",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 8",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 9",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },
  {
    name: "Restaurant 10",
    image: "https://via.placeholder.com/150",
    score: 8.7,
  },

  // Add more restaurants here
];

const MainScreen = () => {
  const route = useRoute();
  const { userId, userName } = route.params;
  const navigation = useNavigation();
  const [topRestaurants, setTopRestaurants] = useState(top10Restaurants);
  const [visitedRestaurants, setVisitedRestaurants] = useState([]);

  const fetchTop10Restaurants = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/api/restaurants/top-restaurants`
      );
      setTopRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching top 10 restaurants:", error.message);
      Alert.alert(
        "An error occurred while fetching top 10 restaurants. Please try again."
      );
    }
  }, []);

  const fetchVisitedRestaurants = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/api/users/getPlacesUserVisited`,
        { params: { userName } }
      );
      setVisitedRestaurants(response.data.placesVisited);
    } catch (error) {
      console.error("Error fetching visited restaurants:", error.message);
      Alert.alert(
        "An error occurred while fetching visited restaurants. Please try again."
      );
    }
  }, [userName]);

  // Use useFocusEffect to call fetchVisitedRestaurants when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchVisitedRestaurants();
      fetchTop10Restaurants();
    }, [fetchVisitedRestaurants, fetchTop10Restaurants]) // Dependency array includes fetchVisitedRestaurants
  );

  return (
    <View style={styles.container}>
      <View style={styles.top10Container}>
        <Text style={styles.title}>Top 10 Restaurants of the Week</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          {topRestaurants.map((restaurant, index) => (
            <TopRatedRestaurantCard
              key={index}
              restaurant={restaurant}
              index={index}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.recentContainer}>
        <Text style={styles.title}>Your Recent Restaurant Visits</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          {visitedRestaurants.map((restaurant, index) => (
            <VisitedRestaurantCard
              key={index}
              userName={userName}
              restaurantName={restaurant.name}
              image={restaurant.mainImage}
            />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("RestaurantPreferenceScreen", {
            username: userName,
          })
        }
      >
        <Text style={styles.buttonText}>Suggest a Restaurant Just for Me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.beige,
  },
  top10Container: {
    marginTop: 20,
  },
  recentContainer: {
    bottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 50,
    color: COLORS.blue,
    fontFamily: "Poppins_700Bold",
    alignSelf: "center",
    textAlign: "center",
  },
  scrollContainer: {
    marginTop: 15,
    marginBottom: 5,
    paddingVertical: 5,
    paddingLeft: 40,
  },
  button: {
    backgroundColor: COLORS.pink,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderColor: COLORS.blue,
    borderWidth: 2,
    Bottom: 20,
  },
  buttonText: {
    color: COLORS.beige,
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
});

export default MainScreen;

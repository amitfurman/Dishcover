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

const MainScreen = () => {
  const route = useRoute();
  const { userId, userName } = route.params;
  const navigation = useNavigation();
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [visitedRestaurants, setVisitedRestaurants] = useState([]);

  const fetchTop10Restaurants = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/api/restaurants/top-restaurants`,
        { userId: userId }
      );
      setTopRestaurants(response.data);
    } catch (error) {
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
        <Text style={styles.title}>Your Recent Restaurant {"\n"}Visits</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          {visitedRestaurants.length === 0 ? (
            <Text style={styles.emptyMessage}>
              You haven't visited any {"\n"}restaurants recently. {"\n"} Start
              exploring and {"\n"}share your experiences!
            </Text>
          ) : (
            visitedRestaurants.map((restaurant) => (
              <VisitedRestaurantCard
                key={restaurant._id}
                userName={userName}
                restaurantName={restaurant.name}
                image={restaurant.mainImage}
              />
            ))
          )}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("RestaurantPreferenceScreen", {
            userName: userName,
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
    marginTop: 30,
    flex: 1,
  },
  recentContainer: {
    marginBottom: 5,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.blue,
    fontFamily: "Poppins_700Bold",
    alignSelf: "center",
    textAlign: "center",
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContainer: {
    marginTop: 10,
    marginBottom: 5,
    paddingVertical: 5,
    paddingLeft: 30,
  },
  button: {
    backgroundColor: COLORS.pink,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderColor: COLORS.blue,
    borderWidth: 2,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.beige,
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  emptyMessage: {
    color: COLORS.blue,
    fontSize: 18,
    fontFamily: "Poppins_500Medium_Italic",
    alignSelf: "center",
    textAlign: "center",
    marginLeft: 50,
  },
});

export default MainScreen;

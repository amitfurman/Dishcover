import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  ScrollView,
} from "react-native";
import axios from "axios";

const handleReview = (restaurant) => {
  // Implement review handling logic here
  // console.log("Reviewing:", restaurant.name);
};

const ReviewScreen = ({ route }) => {
  const { data } = route.params;
  const [restaurants, setRestaurants] = useState([]);

  console.log("Data received in ReviewScreen:", data);

  const handleContinueButton = () => {
    // Implement continue button handling logic here
    //console.log("Continue button pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {" "}
            {data.length} Restaurants Added!
          </Text>
          <Text style={styles.text}>Now in your library,</Text>
          <Text style={styles.text}>
            Edit these ratings to improve your matches.
          </Text>
        </View>
        <View style={styles.reviewContainer}>
          {data.map((restaurant) => (
            <View style={styles.restaurantContainer}>
              <Image
                source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
              />
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Button title="Review" onPress={() => handleReview(restaurant)} />
            </View>
          ))}
          <Button title="Continue" onPress={handleContinueButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  textContainer: {
    padding: 5,
    alignItems: "center",
  },
  titleText: {
    fontFamily: "Cochin",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontFamily: "Cochin",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  reviewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  restaurantContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  restaurantImage: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 20,
    marginBottom: 5,
  },
});

export default ReviewScreen;

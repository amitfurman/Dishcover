import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants";

const VisitedRestaurantCard = ({ userName, restaurantName, image }) => {
  const navigation = useNavigation();

  const handleAddReview = () => {
    // Navigate to the review page with the restaurant details
    navigation.navigate("ReviewPlaceScreen", {
      username: userName,
      restaurantName: restaurantName,
    });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{restaurantName}</Text>
        </View>
        <TouchableOpacity onPress={handleAddReview} style={styles.cardButton}>
          <Text style={styles.buttonText}>Add Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 50,
    height: 200,
  },
  card: {
    flex: 1,
    width: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    zIndex: 2,
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: 120,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
    flexWrap: "wrap",
  },
  cardButton: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginBottom: 13,
    fontFamily: "Poppins_700Bold",
  },
  buttonText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: COLORS.pink,
  },
});

export default VisitedRestaurantCard;

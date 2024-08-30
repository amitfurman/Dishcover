import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const TopRatedRestaurantCard = ({ restaurant, index }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.rank}>{index + 1}</Text>
      <View style={styles.card}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.score}>{restaurant.score}</Text>
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
  rank: {
    fontSize: 90,
    fontWeight: "bold",
    color: COLORS.pink + "70",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    position: "absolute",
    left: -40, // Adjust this value to position the rank number slightly to the left
    zIndex: 1,
    top: 10,
  },
  card: {
    width: 200,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    zIndex: 2,
  },
  image: {
    width: "100%",
    height: 120,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  score: {
    fontSize: 15,
    marginHorizontal: 10,
    marginBottom: 30,
  },
});

export default TopRatedRestaurantCard;

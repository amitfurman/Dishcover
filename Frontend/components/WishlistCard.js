import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const CardWishlist = ({ name, image, onPress }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity onPress={onPress} style={styles.cardButton}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    padding: 10,
    color: COLORS.blue,
    textAlign: "center",
  },
  cardButton: {
    padding: 10,
    fontFamily: "Poppins_700Bold",
    backgroundColor: COLORS.pink,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
});

export default CardWishlist;

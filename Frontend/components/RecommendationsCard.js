import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { COLORS } from "../constants";

const RecommendationsCard = ({
  name,
  image,
  type,
  city,
  matchingPercentage,
  onHeartPress, // Add onHeartPress as a prop
}) => {
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  const handleHeartPress = () => {
    setIsAddedToWishlist(!isAddedToWishlist);
    onHeartPress(); // Call the onHeartPress function passed as a prop
  };

  const percentageValue = parseInt(matchingPercentage, 10);
  const progressBarWidth = `${percentageValue}%`;

  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.type}>
            {type} | {city}
          </Text>
        </View>
        <TouchableOpacity onPress={handleHeartPress}>
          <MaterialCommunityIcons
            name="heart"
            size={30}
            color={isAddedToWishlist ? COLORS.pink : COLORS.white}
            style={{
              textShadowColor: isAddedToWishlist ? "transparent" : COLORS.black,
              textShadowRadius: 3,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.matchingContainer}>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBarFilled, { width: progressBarWidth }]}
          />
          <View style={styles.progressBarBackground} />
        </View>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{matchingPercentage}</Text>
          <Text style={styles.matchText}>match</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    width: 330,
    margin: 15,
    borderRadius: 5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
  },
  image: {
    width: 310,
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignSelf: "center",
    top: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  name: {
    fontSize: 20,
    color: COLORS.blue,
    fontFamily: "Poppins_700Bold",
  },
  type: {
    fontSize: 17,
    color: COLORS.blue,
    paddingTop: 5,
  },
  matchingContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    paddingBottom: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "gray",
  },
  progressBarFilled: {
    height: "100%",
    backgroundColor: COLORS.pink,
  },
  progressBarBackground: {
    height: "100%",
    flex: 1,
  },
  percentageContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  matchText: {
    fontSize: 14,
    color: "gray",
  },
});

export default RecommendationsCard;

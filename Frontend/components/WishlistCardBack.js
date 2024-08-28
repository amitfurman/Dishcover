import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { COLORS } from "../constants";

// Get screen dimensions
const { width, height } = Dimensions.get("screen");

const CardBackWishlist = ({ visible, onClose, details }) => {
  if (!details) return null;

  const {
    name,
    rating,
    location,
    priceLevel,
    images,
    menuLink,
    description,
    openingHours,
    rankingString,
    type,
  } = details;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="close-circle"
            size={30}
            color="black"
            onPress={onClose}
            style={styles.closeIcon}
          />
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.location}>{location}</Text>
            <Text style={styles.rankingString}>{rankingString}</Text>
            <View style={styles.carouselContainer}>
              <Carousel
                loop
                width={width * 0.8}
                height={height * 0.25}
                autoPlay
                autoPlayInterval={3000}
                data={images}
                renderItem={({ item, index }) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: item }} style={styles.image} />
                  </View>
                )}
              />
            </View>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.openingHoursContainer}>
              <Text style={styles.openingHoursTitle}>Opening Hours</Text>
              <View style={styles.openingHoursTextContainer}>
                {openingHours.split(", ").map((slot, index) => {
                  const [day, time] = slot.split(": ");
                  return (
                    <Text key={index} style={styles.openingHoursText}>
                      <Text style={styles.day}>{day}</Text>:{" "}
                      <Text style={styles.time}>{time}</Text>
                    </Text>
                  );
                })}
              </View>
              <View style={styles.priceTypeContainer}>
                <Text style={styles.priceLevel}>{priceLevel}</Text>
                <Text style={styles.type}>{type}</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(menuLink)}
                  style={styles.menuLink}
                >
                  <Image
                    source={require("../assets/symbols/menu.png")}
                    style={styles.icon}
                  />
                  <MaterialCommunityIcons
                    name="arrow-top-right"
                    size={24}
                    color="#4900D9"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxHeight: "90%", // Limit the height of the card to enable scrolling
    backgroundColor: "#f9f2eb",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 20, // Add some padding to the bottom
  },
  name: {
    fontFamily: "Poppins_700Bold",
    color: COLORS.blue,
    fontSize: 26,
    textAlign: "center",
    marginTop: 30, // To avoid overlap with the close icon
  },
  location: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.pink,
    fontSize: 16,
    textAlign: "center",
  },
  rankingString: {
    fontFamily: "Poppins_300Light_Italic",
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  carouselContainer: {
    width: width * 0.8,
    height: height * 0.25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: width * 0.8,
    height: height * 0.25,
    resizeMode: "cover",
    borderRadius: 10,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    color: "#333",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  openingHoursTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    marginBottom: 5,
    color: COLORS.pink,
    marginLeft: 10,
  },
  day: {
    color: COLORS.blue,
    fontFamily: "Poppins_600SemiBold_Italic",
    fontSize: 16,
  },
  time: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  openingHoursContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  openingHoursText: {
    lineHeight: 20,
  },
  openingHoursTextContainer: {
    marginLeft: 20,
  },
  priceLevel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
  type: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#999",
    marginTop: 5,
  },
  menuLink: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 20,
  },
  priceTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default CardBackWishlist;

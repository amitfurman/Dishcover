import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../colors";

const PasteListScreen = ({ route }) => {
  const navigation = useNavigation();
  const { username, data } = route.params;

  const handleContinueButton = () => {
    navigation.navigate("SecondIntro", { username: username });
  };

  const handleReviewButton = (restaurant) => {
    console.log("Review button pressed for:", restaurant);
    navigation.navigate("ReviewPlaceScreen", { data: restaurant });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{data.length} Restaurants Added!</Text>
          <Text style={styles.text}>Now in your library,</Text>
          <Text style={styles.text}>
            Edit these ratings to improve your matches.
          </Text>
        </View>
        <View style={styles.reviewContainer}>
          {data.map((restaurant, index) => (
            <View key={index} style={styles.restaurantContainer}>
              <Image
                source={{ uri: restaurant.mainImage }}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantDetails}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleReviewButton(restaurant)}
                >
                  <Text style={styles.buttonText}>Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueButton}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
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
    top: 20,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.black,
  },
  text: {
    fontFamily: "Cochin",
    top: 15,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: COLORS.black,
  },
  reviewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 35,
  },
  restaurantContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
  },
  restaurantImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  restaurantDetails: {
    marginLeft: 10,
    flex: 1,
    alignItems: "center",
  },
  restaurantName: {
    fontFamily: "Cochin",
    fontSize: 25,
    color: COLORS.black,
  },
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButton: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: "center",
  },
});

export default PasteListScreen;

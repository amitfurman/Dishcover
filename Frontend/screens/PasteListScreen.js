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
import { useNavigation} from "@react-navigation/native";
import { COLORS } from "../colors";
import Icon from 'react-native-vector-icons/Ionicons'; // Importing icons

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.textContainer}>
        <Text style={styles.titleText}>{data.length} Restaurants Added 🍽️</Text>
        <Text style={styles.text}>
          Rate them to get even better recommendations!
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
            <Text style={styles.continueButtonText}>Continue</Text>
            <Icon
              name="arrow-forward-circle"
              size={20}
              color={COLORS.pink}
              style={{ marginLeft: 5 }} 
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
    width: '100%',
  },
  textContainer: {
    padding: 5,
    alignItems: "center",
    width: "100%",
  },
  titleText: {
    fontFamily: "Poppins_700Bold",
    top: 20,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.black,
  },
  text: {
    fontFamily: "Poppins_500Medium",
    top: 15,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
    color: COLORS.pink,
  },
  reviewContainer: {
    width: "100%",
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
    backgroundColor: COLORS.beige,
    borderRadius: 10,
    minHeight: 150,
    padding: 10,
    borderColor: COLORS.blue,
    borderWidth: 0.3,
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
    fontFamily: "Poppins_600SemiBold",
    fontSize: 25,
    color: COLORS.black,
  },
  button: {
    backgroundColor: COLORS.pink,
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
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row", // Ensure button and icon are in the same row
  },
  continueButtonText: {
    color: COLORS.pink,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
},
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
  },
});

export default PasteListScreen;

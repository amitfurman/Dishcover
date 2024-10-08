import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import qs from "qs";
import { COLORS } from "../constants";
import Icon from "react-native-vector-icons/Ionicons"; // Importing icons
import { url } from "../constants";

const CopyAndPasteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fromScreen, userId, userName } = route.params;
  const [value, setValue] = useState("");

  useEffect(() => {
    // Clear input value whenever fromScreen changes
    setValue("");
  }, [fromScreen]);

  const handleClearTextButton = () => {
    setValue("");
  };

  const handleTextChange = (text) => {
    const cleanedText = text
      .split("\n")
      .map((line) => line.replace(/^\s*-\s*\[\s*[x ]\s*\]\s*/, "").trim())
      .join("\n");
    setValue(cleanedText);
  };

  const handleContinueButton = async () => {
    console.log("Continue button pressed:", value, userName);
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    // Extract only the restaurant names
    const restaurantNames = lines
      .map((item) => {
        // Remove '- [ ] ' and trim whitespace
        return item.replace(/- \[ \] /g, "").trim();
      })
      .filter((name) => name !== ""); // Filter out empty strings

    if (fromScreen === "FirstScreen") {
      try {
        const response = await axios.post(
          `${url}/api/users/placesUserVisited`,
          {
            userName: userName,
            placesVisited: [...new Set(restaurantNames)],
          }
        );

        const { status, data } = response.data;

        if (status === "ok") {
          console.log("Data received successfully:", data);
          navigation.navigate("PasteListScreen", {
            userId: userId,
            userName: userName,
            data: data,
          });
        } else {
          console.error("Error from server:", data);
        }
      } catch (error) {
        if (
          error.response.data.data == "No listings found with the given names."
        ) {
          Alert.alert(
            "We couldn't find the restaurant you entered, but we're always adding new places!\n Please check back soon"
          );
          navigation.navigate("SecondIntro", {
            userId: userId,
            userName: userName,
          });
        } else {
          handleError(error);
        }
      }
    } else if (fromScreen === "SecondScreen") {
      try {
        const response = await axios.post(
          `${url}/api/users/updatePlacesUserWantToVisit`,
          {
            userName: userName,
            placesToVisit: [...new Set(lines)],
          }
        );

        const { status } = response.data;

        if (status === "ok") {
          navigation.navigate("BottomTabs", {
            userId: userId,
            userName: userName,
          });
        } else {
          console.error("Error from server:", data);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error("Server responded with an error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Share Your Favorite Restaurants</Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            editable
            multiline
            numberOfLines={50}
            maxLength={500}
            onChangeText={handleTextChange}
            value={value}
            placeholder={
              "Paste your list here! \nOne restaurant per line.\n\nFor example:\nEmesh\nMalka"
            }
            placeholderTextColor={COLORS.black}
            style={styles.textInputStyle}
            autoFocus={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClearTextButton}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={handleContinueButton}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Icon
              name="arrow-forward-circle"
              size={20}
              color={COLORS.pink}
              style={{ marginLeft: 5 }} // Adjust the styling as needed
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CopyAndPasteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  titleTextContainer: {
    paddingTop: 20,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    color: COLORS.blue,
    fontFamily: "Poppins_700Bold",
  },
  textInputContainer: {
    flex: 1,
    width: "80%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  textInputStyle: {
    borderRadius: 5,
    width: "100%",
    minHeight: 150,
    padding: 10,
    borderColor: COLORS.black,
    borderWidth: 1,
    backgroundColor: COLORS.beige,
    color: COLORS.black,
    fontFamily: "Poppins_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingBottom: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: COLORS.beige,
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  continueButton: {
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.pink,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
});

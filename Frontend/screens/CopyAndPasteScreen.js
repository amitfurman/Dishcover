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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { COLORS } from "../colors";

const url = "http://10.100.102.4:3000";
//const url = "http://192.168.68.111:3000";

const CopyAndPasteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fromScreen, username } = route.params;
  const [value, setValue] = useState("");

  useEffect(() => {
    // Clear input value whenever fromScreen changes
    setValue("");
  }, [fromScreen]);

  const handleClearTextButton = () => {
    setValue("");
  };

  const handleContinueButton = async () => {
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
    console.log("Sending data to server:", restaurantNames);

    if (fromScreen === "FirstScreen") {
      try {
        const response = await axios.post(`${url}/placesUserVisit`, {
          username,
          placesVisited: [...new Set(restaurantNames)],
        });

        const { status, data } = response.data;

        if (status === "ok") {
          console.log("Data received successfully:", data);
          navigation.navigate("PasteListScreen", {
            username: username,
            data: data,
          });
        } else {
          console.error("Error from server:", data);
        }
      } catch (error) {
        handleError(error);
      }
    } else if (fromScreen === "SecondScreen") {
      try {
        const response = await axios.post(`${url}/placesUserWantToVisit`, {
          username,
          placesToVisit: [...new Set(lines)],
        });

        const { status } = response.data;

        if (status === "ok") {
          navigation.navigate("MainScreen");
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
            onChangeText={setValue}
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
    width: "100%",
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
  },
  buttonText: {
    color: COLORS.pink,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
});

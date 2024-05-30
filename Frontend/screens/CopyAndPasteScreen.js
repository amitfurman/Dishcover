import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  Button,
} from "react-native";

const CopyAndPasteScreen = () => {
  const [value, onChangeText] = useState("");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // Add any additional actions when keyboard shows up
      }
    );

    // Cleanup function
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleClearTextButton = () => {
    if (value.trim() !== "") {
      onChangeText("");
    }
  };

  const handleContinueButton = () => {
    // Handle continue button press
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>Copy & Paste list of restaurants</Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          ref={(input) => {
            this.textInput = input;
          }}
          editable
          multiline
          numberOfLines={8}
          maxLength={40}
          onChangeText={(text) => onChangeText(text)}
          value={value}
          placeholder={
            "Paste list here! \nOne restaurant per line.\n\nFor example:\nEmesh\nMalka"
          }
          placeholderTextColor="rgba(0, 0, 0, 0.6)" // Set placeholder text color with light opacity
          style={styles.textInputStyle} // Add border styles
          autoFocus={true} // Focus the text input on component mount
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={handleContinueButton} />
        <Button title="Clear Text" onPress={handleClearTextButton} />
      </View>
    </SafeAreaView>
  );
};

export default CopyAndPasteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  titleTextContainer: {
    paddingTop: 20,
  },
  titleText: {
    fontFamily: "Cochin",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
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
    borderColor: "black",
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingBottom: 350,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    paddingHorizontal: 32,
    borderRadius: 20, // Adjust this value to make the corners rounder
    elevation: 3,
    backgroundColor: "black",
    marginBottom: 10, // Add margin bottom to create space between buttons
  },
  text: {
    //fontFamily: 'Cochin',
    fontSize: 16,
    lineHeight: 15,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

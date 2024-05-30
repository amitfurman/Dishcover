import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

function FirstIntroScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paginationContainer}>
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>
          Do you have a list of restaurants you've already visited?
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Yes, Copy & Paste List"
          onPress={() => navigation.navigate("CopyAndPaste")}
        />
        <Button
          title="Maybe Later"
          onPress={() => navigation.navigate("SecondIntro")}
        />
      </View>
    </SafeAreaView>
  );
}

export default FirstIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  paginationContainer: {
    alignItems: "center",
    marginTop: 100, // Adjust this value to move the dots higher or lower
  },
  pagination: {
    flexDirection: "row",
  },
  dot: {
    width: 30,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontFamily: "Cochin",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
  buttonContainer: {
    paddingBottom: 100, // Adjust this value to move the buttons higher or lower
    alignItems: "center",
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

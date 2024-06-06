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
import { COLORS } from "../colors";

function FirstIntroScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
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
          <TouchableOpacity
            style={styles.CopyAndPasteButton}
            onPress={() => navigation.navigate("CopyAndPaste")}
          >
            <Text style={styles.CopyAndPasteButtonText}>Yes, Copy & Paste List</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.maybeLaterButtonContainer}>
          <TouchableOpacity
            style={styles.maybeLaterButton}
            onPress={() => navigation.navigate("SecondIntro")}
          >
            <Text style={styles.maybeLaterButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default FirstIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 20,
    marginHorizontal: 20,
    height: "80%",
    width: "90%",
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.pink,
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
  text: {
    //fontFamily: 'Cochin',
    fontSize: 16,
    lineHeight: 15,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  CopyAndPasteButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20, // Adjust this value for spacing between the buttons and the content
  },
  maybeLaterButtonContainer: {
    alignItems: "center",
    marginBottom: 20, // Adjust this value for spacing between the button and the bottom of the card
  },
  CopyAndPasteButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  maybeLaterButtonText: {
    color: COLORS.pink,
    fontSize: 20,
    textAlign: 'center',
  },
});

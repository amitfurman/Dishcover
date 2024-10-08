import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../constants";
import { useNavigation, useRoute } from "@react-navigation/native";

function FirstIntroScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, userName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
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
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/copyListFromIphone.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.CopyAndPasteButton}
            onPress={() =>
              navigation.navigate("CopyAndPaste", {
                fromScreen: "FirstScreen",
                userId: userId,
                userName: userName,
              })
            }
          >
            <Text style={styles.CopyAndPasteButtonText}>
              Yes, Copy & Paste List
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.maybeLaterButtonContainer}>
          <TouchableOpacity
            style={styles.maybeLaterButton}
            onPress={() =>
              navigation.navigate("SecondIntro", {
                userId: userId,
                userName: userName,
              })
            }
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
    backgroundColor: COLORS.beige,
  },
  paginationContainer: {
    alignItems: "center",
    marginTop: 80, // Adjust this value to move the dots higher or lower
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
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    lineHeight: 45,
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
    backgroundColor: COLORS.pink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  maybeLaterButtonContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  CopyAndPasteButtonText: {
    fontFamily: "Poppins_500Medium",
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  maybeLaterButtonText: {
    fontFamily: "Poppins_700Bold",
    color: COLORS.blue,
    fontSize: 18,
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  imageContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
  },
});

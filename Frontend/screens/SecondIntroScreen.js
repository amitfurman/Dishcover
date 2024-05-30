import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const SecondIntroScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paginationContainer}>
        <View style={styles.pagination}>
          <View style={[styles.dot]} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>
          Do you have a list of restaurants you'd like to visit?
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Yes, Copy & Paste List"
          onPress={() => navigation.navigate("CopyAndPaste")}
        />
        <Button
          title="Yes, Swipe"
          onPress={() => navigation.navigate("SwipeRestaurants")}
        />
        <Button title="Maybe Later" onPress={() => console.log("yes")} />
      </View>
    </SafeAreaView>
  );
};

export default SecondIntroScreen;

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
});

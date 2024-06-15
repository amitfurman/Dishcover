import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../colors";
import LottieView from 'lottie-react-native';

const SecondIntroScreen = () => {
  const navigation = useNavigation();
  const { username } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.paginationContainer}>
          <View style={styles.pagination}>
            <View style={[styles.dot]} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>
            Got a list of restaurants you'd like to visit?
          </Text>
        </View>
        <View style={styles.animationContainer}>
          
          <LottieView
            source={require('../assets/swipe.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.CopyAndPasteButton]}
            onPress={() =>
              navigation.navigate("CopyAndPaste", {
                fromScreen: "SecondScreen",
                username: username,
              })
            }
          >
            <Text style={styles.buttonText}>Paste List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.CopyAndPasteButton]}
            onPress={() =>
              navigation.navigate("SwipeRestaurants", {
                username: username,
              })
            }
          >
            <Text style={styles.buttonText}>Swipe</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.maybeLaterButtonContainer}>
          <TouchableOpacity
            style={styles.maybeLaterButton}
            onPress={() =>
              navigation.navigate("MainScreen", { username: username })
            }
          >
            <Text style={styles.maybeLaterButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
    overflow: "hidden", // Ensure the overlays do not overflow the card
  },
  paginationContainer: {
    alignItems: "center",
    marginTop: 80,
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
  animationContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  CopyAndPasteButton: {
    backgroundColor: COLORS.pink,
    marginHorizontal: 10,
  },
  buttonText: {
    fontFamily: "Poppins_500Medium",
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  maybeLaterButtonContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  maybeLaterButtonText: {
    fontFamily: "Poppins_700Bold",
    color: COLORS.blue,
    fontSize: 18,
    textAlign: "center",
  },
});

export default SecondIntroScreen;

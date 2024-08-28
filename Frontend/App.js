import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Video } from "expo-av";
import HomePageButton from "./components/HomePageButton";
import { COLORS } from "./constants";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_900Black,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold_Italic,
  PlayfairDisplay_700Bold_Italic,
  PlayfairDisplay_800ExtraBold_Italic,
  PlayfairDisplay_900Black_Italic,
} from "@expo-google-fonts/playfair-display";

import {
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";

import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";

import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import SwipeRestaurants from "./screens/SwipeRestaurants";
import FirstIntroScreen from "./screens/FirstIntroScreen";
import CopyAndPasteScreen from "./screens/CopyAndPasteScreen";
import SecondIntroScreen from "./screens/SecondIntroScreen";
import PasteListScreen from "./screens/PasteListScreen";
import ReviewPlaceScreen from "./screens/ReviewPlaceScreen";
import MainScreen from "./screens/MainScreen";
import RestaurantPreferenceScreen from "./screens/RestaurantPreferenceScreen";
import BottomTabsNavigator from "./components/BottomTabsNavigator";
import WishlistScreen from "./screens/WishlistScreen";
import RecommendationsScreen from "./screens/RecommendationsScreen";

// style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View className="bg-white h-full w-full">
      <View style={styles.container}>
        <Video
          source={require("./assets/Homepage.mp4")}
          rate={1.0}
          volume={0.0}
          isMuted={true}
          resizeMode="cover"
          shouldPlay
          style={styles.video}
        />
      </View>
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <HomePageButton
          text="Sign Up"
          textColor={COLORS.blue}
          backgroundColor="#f8f7f4"
          borderColor={COLORS.pink}
          onPress={() => navigation.navigate("Signup")}
          //onPress={() => navigation.navigate("WishlistScreen")}
        />
        <HomePageButton
          text="Sign In"
          textColor="#f8f7f4"
          backgroundColor={COLORS.pink}
          borderColor={COLORS.blue}
          onPress={() => navigation.navigate("Signin")}
          //onPress={() => navigation.navigate("SwipeRestaurants")}
        />
      </View>
    </View>
  );
}
const { width, height } = Dimensions.get("window");

const Stack = createNativeStackNavigator();

function App() {
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    PlayfairDisplay_900Black,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_500Medium_Italic,
    PlayfairDisplay_600SemiBold_Italic,
    PlayfairDisplay_700Bold_Italic,
    PlayfairDisplay_800ExtraBold_Italic,
    PlayfairDisplay_900Black_Italic,
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });
  if (!fontsLoaded) {
    return <View></View>;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        //initialRouteName="RecommendationsScreen"
        //initialRouteName="MainScreen"
        initialRouteName="SwipeRestaurants"
        //initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="SwipeRestaurants" component={SwipeRestaurants} />
        <Stack.Screen name="FirstIntro" component={FirstIntroScreen} />
        <Stack.Screen name="SecondIntro" component={SecondIntroScreen} />
        <Stack.Screen name="CopyAndPaste" component={CopyAndPasteScreen} />
        <Stack.Screen name="PasteListScreen" component={PasteListScreen} />
        <Stack.Screen name="ReviewPlaceScreen" component={ReviewPlaceScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
        <Stack.Screen
          name="RestaurantPreferenceScreen"
          component={RestaurantPreferenceScreen}
          options={{
            presentation: "modal",
            // headerShown: false,
          }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabsNavigator}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="RecommendationsScreen"
          component={RecommendationsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    bottom: 60,
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height * 0.9,
  },
});

export default App;

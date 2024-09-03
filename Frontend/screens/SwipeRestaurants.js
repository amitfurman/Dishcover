import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import CardBack from "../components/CardBack";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { COLORS } from "../constants";
import { url } from "../constants";

export default function SwipeRestaurants() {
  const route = useRoute();
  const { userId, userName } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [swipedLeft, setSwipedLeft] = useState([]);
  const [swipedRight, setSwipedRight] = useState([]);
  const [flipped, setFlipped] = useState(false); // State to track if the card is flipped
  const { width, height } = Dimensions.get("screen");
  //for swipe
  const swipe = useRef(new Animated.ValueXY()).current;
  const titleSign = useRef(new Animated.Value(1)).current;
  const flipAnim = useRef(new Animated.Value(0)).current; // Animated value for flipping

  useEffect(() => {
    const fetchRandomRestaurants = async () => {
      try {
        const response = await axios.get(
          `${url}/api/restaurants/user-random-restaurants`,
          {
            params: {
              userId: userId,
            },
          }
        );
        console.log(response.data);
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching random restaurants:", error);
        setLoading(false);
      }
    };

    fetchRandomRestaurants(); // Fetch data when the component mounts
  }, []); // Empty dependency array means this runs once when the component mounts

  // Animated value to control flip button opacity
  const flipButtonOpacity = useRef(new Animated.Value(1)).current;

  //panResponder config
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy, y0 }) => {
      swipe.setValue({ x: dx, y: dy });
      titleSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
      // Hide the flip button when the card starts to move
      Animated.timing(flipButtonOpacity, {
        toValue: 0,
        duration: 20,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > width * 0.4;

      if (isActionActive) {
        // Update swiped arrays based on swipe direction
        const restaurantName = restaurants[0].name; // Get the name of the restaurant

        if (direction > 0) {
          setSwipedRight((prev) => [...prev, restaurantName]);
        } else {
          setSwipedLeft((prev) => [...prev, restaurantName]);
        }

        //swipe the card out
        Animated.timing(swipe, {
          toValue: {
            x: direction * width * 2,
            y: dy,
          },
          duration: 2000,
          useNativeDriver: true,
        }).start(removeTopCard);
      } else {
        //return the card to the center
        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start(() => {
          Animated.timing(flipButtonOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }).start();
        });
      }
    },
  });

  const removeTopCard = useCallback(() => {
    setRestaurants((prev) => prev.slice(1));
    swipe.setValue({ x: 0, y: 0 });
    // Ensure flip button is visible for the next card
    Animated.timing(flipButtonOpacity, {
      toValue: 1,
      duration: 10,
      useNativeDriver: true,
    }).start();
  }, [swipe, flipButtonOpacity]);

  const handleChoice = useCallback(
    (direction) => {
      Animated.timing(swipe.x, {
        toValue: direction * width * 2,
        duration: 2000,
        useNativeDriver: true,
      }).start(removeTopCard);
    },
    [removeTopCard, swipe.x]
  );

  const flipCard = useCallback(() => {
    if (flipped) {
      // Flip back to the front side
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Flip to the back side
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  }, [flipped, flipAnim]);

  // Interpolate the animated value to get rotation in degrees
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const handleStopSwiping = async () => {
    console.log("Swiped left:", swipedLeft);
    console.log("Swiped right:", swipedRight);
    //TODO: Send swipedLeft to the backend

    try {
      const response = await axios.post(
        `${url}/api/users/updatePlacesUserWantToVisit`,
        {
          userName: userName,
          placesToVisit: [...new Set(swipedRight)],
        }
      );

      const { status } = response.data;

      if (status === "ok") {
        navigation.navigate("BottomTabs", { userId, userName });
      } else {
        console.error("Error from server:", data);
      }
    } catch (error) {
      handleError(error);
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
    <LinearGradient colors={["white", "white"]} style={styles.background}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Text style={styles.title}>Swipe as much as you want!</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleStopSwiping}
          >
            <Text style={styles.homeButtonText}>Stop Swiping</Text>
          </TouchableOpacity>
          {restaurants
            .map((restaurant, index) => {
              const isFirst = index === 0;
              const dragHandlers = isFirst ? panResponder.panHandlers : {};
              return (
                <View
                  key={`${restaurant.name}-${index}`}
                  style={styles.cardWrapper}
                >
                  <Animated.View
                    style={{ ...styles.flipButton, opacity: flipButtonOpacity }}
                  >
                    <TouchableOpacity onPress={flipCard}>
                      <MaterialCommunityIcons
                        name="swap-horizontal"
                        size={32}
                        color={COLORS.beige}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View
                    style={{
                      transform: [{ rotateY: frontInterpolate }],
                      backfaceVisibility: "hidden",
                      // position: 'absolute',
                      // width: '100%',
                      // height: '100%',
                    }}
                  >
                    <Card
                      name={restaurant.name}
                      rating={restaurant.rating}
                      location={restaurant.city}
                      priceLevel={restaurant.priceLevel}
                      image={restaurant.mainImage}
                      isFirst={isFirst}
                      swipe={swipe}
                      titleSign={titleSign}
                      isVeganFriendly={restaurant.isVeganFriendly}
                      isWheelchairAccessible={restaurant.isWheelchairAccessible}
                      isGlutenFree={restaurant.isGlutenFree}
                      type={restaurant.type}
                      {...dragHandlers}
                    />
                  </Animated.View>
                  <Animated.View
                    style={{
                      transform: [{ rotateY: backInterpolate }],
                      backfaceVisibility: "hidden",
                      position: "absolute",
                      // width: '100%',
                      // height: '100%',
                    }}
                  >
                    <CardBack
                      name={restaurant.name}
                      rating={restaurant.rating}
                      location={restaurant.location}
                      priceLevel={restaurant.priceLevel}
                      images={restaurant.images}
                      menuLink={restaurant.menuLink}
                      description={restaurant.description}
                      openingHours={restaurant.openingHours}
                      rankingString={restaurant.rankingString}
                      isFirst={isFirst}
                      swipe={swipe}
                      titleSign={titleSign}
                      type={restaurant.type}
                      {...dragHandlers}
                    />
                  </Animated.View>
                </View>
              );
            })
            .reverse()}
          <Footer handleChoice={handleChoice} />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.pink,
    textAlign: "center",
    flex: 1,
    top: 100,
    fontFamily: "Poppins_700Bold",
  },
  homeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: COLORS.blue,
    borderRadius: 5,
  },
  homeButtonText: {
    color: COLORS.beige,
    fontWeight: "bold",
  },
  cardWrapper: {
    position: "absolute",
  },
  flipButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(255, 89, 89, 0.9)",
    borderRadius: 20,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.pink,
    textAlign: "center",
  },
});

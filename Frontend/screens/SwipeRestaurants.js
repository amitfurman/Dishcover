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
import { restaurants as restaurantsArray } from "../data";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import CardBack from "../components/CardBack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../colors";

export default function SwipeRestaurants() {
  const route = useRoute();
  const { username } = route.params;
  const [restaurants, setRestaurants] = useState(restaurantsArray);
  const [flipped, setFlipped] = useState(false); // State to track if the card is flipped
  const { width, height } = Dimensions.get("screen");
  //for swipe
  const swipe = useRef(new Animated.ValueXY()).current;
  const titleSign = useRef(new Animated.Value(1)).current;
  const flipAnim = useRef(new Animated.Value(0)).current; // Animated value for flipping

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

  useEffect(() => {
    if (!restaurants.length) {
      setRestaurants(restaurantsArray);
    }
  }, [restaurants.length]);

  // Interpolate the animated value to get rotation in degrees
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <LinearGradient colors={[COLORS.blue, COLORS.blue]} style={styles.background}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {restaurants
          .map((restaurant, index) => {
            const isFirst = index === 0;
            const dragHandlers = isFirst ? panResponder.panHandlers : {};
            return (
              <View key={restaurant.name} style={styles.cardWrapper}>
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
                    location={restaurant.location}
                    priceLevel={restaurant.priceLevel}
                    image={restaurant.image}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    opacity: 0.7,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});

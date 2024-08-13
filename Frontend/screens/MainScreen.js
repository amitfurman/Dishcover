import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopRatedRestaurantCard from '../components/TopRatedRestaurantCard';
import { COLORS } from '../colors';

const topRestaurants = [
  { name: "Restaurant 1", image: "https://via.placeholder.com/150", score: 9.5 },
  { name: "Restaurant 2", image: "https://via.placeholder.com/150", score: 8.7 },
  { name: "Restaurant 3", image: "https://via.placeholder.com/150", score: 8.7 },
  { name: "Restaurant 4", image: "https://via.placeholder.com/150", score: 8.7 },
  { name: "Restaurant 5", image: "https://via.placeholder.com/150", score: 8.7 },
  { name: "Restaurant 6", image: "https://via.placeholder.com/150", score: 8.7 },
  { name: "Restaurant 7", image: "https://via.placeholder.com/150", score: 8.7 },
  { name: "Restaurant 8", image: "https://via.placeholder.com/150", score: 8.7 },
  { name: "Restaurant 9", image: "https://via.placeholder.com/150", score: 8.7 },
  // Add more restaurants here
];

const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 10 Restaurants of the Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {topRestaurants.map((restaurant, index) => (
          <TopRatedRestaurantCard key={index} restaurant={restaurant} index={index} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RestaurantPreferenceScreen')}
      >
        <Text style={styles.buttonText}>Suggest a Restaurant Just for Me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.beige,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 50,
    color: COLORS.blue,
    fontFamily: 'Poppins_700Bold',
  },
  scrollContainer: {
    marginBottom: 30,
    paddingVertical: 10,
    paddingLeft: 40,
  },
  button: {
    backgroundColor: COLORS.pink,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: COLORS.blue,
    borderWidth: 2,
  },
  buttonText: {
    color: COLORS.beige,
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
});

export default MainScreen;

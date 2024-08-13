import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import OptionList from "../components/OptionList"; // Import the new OptionList component
import { COLORS } from "../colors";

const restaurantTypes = [
  { name: "Israeli", image: require("../assets/symbols/falafel.png") },
  { name: "Italian", image: require("../assets/symbols/spaghetti.png") },
  { name: "Bar", image: require("../assets/symbols/beer.png") },
  { name: "Greek", image: require("../assets/symbols/greek.png") },
  { name: "Cafe", image: require("../assets/symbols/coffee.png") },
  { name: "Asian", image: require("../assets/symbols/sushi.png") },
  { name: "Mexican", image: require("../assets/symbols/taco.png") },
  { name: "American", image: require("../assets/symbols/burgerFull.png") },
  { name: "Pizza", image: require("../assets/symbols/pizza.png") },
  { name: "Indian", image: require("../assets/symbols/indian.png") },
  { name: "Street Food", image: require("../assets/symbols/noodle.png") },
  { name: "Seafood", image: require("../assets/symbols/shrimp.png") },
  { name: "Desert", image: require("../assets/symbols/donut.png") },
  { name: "Steakhouse", image: require("../assets/symbols/steak.png") },
  { name: "Georgian", image: require("../assets/symbols/khachapuri.png") },

  // { name: "Diner", image: require("../assets/symbols/greek.png") },
 // Georgian


];

const budgets = ["$-$$", "$$-$$$", "$$$-$$$$"];
const atmospheres = ["Casual", "Fine Dining", "Fast Food", "Romantic"];

const vibe = [
  { name: "Israeli", image: require("../assets/symbols/falafel.png") },
  { name: "Italian", image: require("../assets/symbols/spaghetti.png") },
  { name: "Bar", image: require("../assets/symbols/beer.png") },
  { name: "Greek", image: require("../assets/symbols/greek.png") },
];

const RestaurantPreferenceScreen = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("Casual");

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const selectBudget = (budget) => {
    setSelectedBudget(budget);
  };

  const selectAtmosphere = (atmosphere) => {
    setSelectedAtmosphere(atmosphere);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Choose Your Dining Adventure!</Text>
      <OptionList
        title="Type of Restaurant"
        data={restaurantTypes}
        selectedItems={selectedTypes}
        onToggle={toggleType}
        dataType="image"
      />

      <OptionList
        title="Budget"
        data={budgets}
        selectedItems={[selectedBudget]}
        onToggle={selectBudget}
        dataType="text"
      />

      <OptionList
        title="Atmosphere"
        data={atmospheres}
        selectedItems={[selectedAtmosphere]}
        onToggle={selectAtmosphere}
        dataType="text"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.beige,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: COLORS.pink,
    textAlign: "center",
    marginBottom: 20,
  },
  selectedText: {
    fontFamily: "Poppins_400Regular",
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});

export default RestaurantPreferenceScreen;

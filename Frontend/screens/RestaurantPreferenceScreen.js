import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import OptionList from "../components/OptionList"; // Import the new OptionList component
import { COLORS } from "../colors";

const restaurantTypes = ["Italian", "Asian", "Mexican", "American", "Indian", "Mediterranean"];
const budgets = ["$-$$", "$$-$$$", "$$$-$$$$"];
const atmospheres = ["Casual", "Fine Dining", "Fast Food", "Romantic"];

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
      <OptionList
        title="Type of Restaurant"
        data={restaurantTypes}
        selectedItems={selectedTypes}
        onToggle={toggleType}
      />

      <OptionList
        title="Budget"
        data={budgets}
        selectedItems={[selectedBudget]}
        onToggle={selectBudget}
      />

      <OptionList
        title="Atmosphere"
        data={atmospheres}
        selectedItems={[selectedAtmosphere]}
        onToggle={selectAtmosphere}
      />

      <Text style={styles.selectedText}>
        Selected Types: {selectedTypes.join(", ")}
      </Text>
      <Text style={styles.selectedText}>Budget: {selectedBudget}</Text>
      <Text style={styles.selectedText}>Atmosphere: {selectedAtmosphere}</Text>
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
  selectedText: {
    fontFamily: "Poppins_400Regular",
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});

export default RestaurantPreferenceScreen;

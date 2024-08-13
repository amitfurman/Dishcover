import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import OptionList from "../components/OptionList";
import { COLORS } from "../colors";
import { Picker } from "@react-native-picker/picker";

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

const atmospheres = [
  { name: "Romantic", image: require("../assets/symbols/in-love.png") },
  { name: "Family", image: require("../assets/symbols/family.png") },
  { name: "Friends", image: require("../assets/symbols/drinking.png") },
  { name: "Work", image: require("../assets/symbols/suitcase.png") },
];

const RestaurantPreferenceScreen = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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
        dataType="image"
      />

      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={[
            styles.customPicker,
            selectedDistrict
              ? {
                  backgroundColor: COLORS.pink + "20",
                  borderColor: COLORS.pink,
                }
              : { backgroundColor: "#fff", borderColor: COLORS.blue },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectedText}>
            {selectedDistrict || "Select District"}
          </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedDistrict}
                onValueChange={(itemValue) => {
                  setSelectedDistrict(itemValue);
                  setModalVisible(false);
                }}
              >
                <Picker.Item label="Select District" value="" />
                <Picker.Item
                  label="Southern District"
                  value="Southern District"
                />
                <Picker.Item
                  label="Tel Aviv District"
                  value="Tel Aviv District"
                />
                <Picker.Item
                  label="Jerusalem District"
                  value="Jerusalem District"
                />
                <Picker.Item
                  label="Central District"
                  value="Central District"
                />
                <Picker.Item
                  label="Northern District"
                  value="Northern District"
                />
              </Picker>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.beige,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: COLORS.pink,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 25,
  },
  pickerContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  customPicker: {
    height: 50,
    justifyContent: "center",
    // backgroundColor: "#f9f9f9",
    // borderColor: COLORS.blue,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  selectedText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: COLORS.blue,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
  },
});
export default RestaurantPreferenceScreen;

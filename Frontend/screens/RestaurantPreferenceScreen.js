import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import OptionList from "../components/OptionList";
import { url, COLORS } from "../constants";
import { Picker } from "@react-native-picker/picker";
//import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";

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
  { name: "Dessert", image: require("../assets/symbols/donut.png") },
  { name: "Steakhouse", image: require("../assets/symbols/steak.png") },
  { name: "Georgian", image: require("../assets/symbols/khachapuri.png") },
];

const budgets = ["$-$$", "$$-$$$", "$$$-$$$$"];

const atmospheres = [
  { name: "Romantic", image: require("../assets/symbols/in-love.png") },
  { name: "Family", image: require("../assets/symbols/family.png") },
  { name: "Friends", image: require("../assets/symbols/drinking.png") },
  { name: "Work", image: require("../assets/symbols/suitcase.png") },
];

const RestaurantPreferenceScreen = () => {
  const route = useRoute();
  const { username } = route.params;
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isWheelchairAccessible, setIsWheelchairAccessible] = useState(false);

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

  const handleGenerateRestaurant = () => {
    console.log("Generating restaurant...");
    console.log("District:", selectedDistrict);
    console.log("Types:", selectedTypes);
    console.log("Budget:", selectedBudget);
    console.log("Atmosphere:", selectedAtmosphere);
    console.log("Vegan:", isVegan);
    console.log("Gluten Free:", isGlutenFree);
    console.log("Wheelchair Accessible:", isWheelchairAccessible);

    // Generate restaurant based on preferences
    axios
      .get(`${url}/api/user/restaurantsRecommendations`, {
        params: {
          username,
          selectedDistrict,
          selectedTypes,
          selectedBudget,
          selectedAtmosphere,
          isVegan,
          isGlutenFree,
          isWheelchairAccessible,
        },
      })
      .then((response) => {
        console.log("Generated restaurant:", response.data);
        // TODO: Show the generated restaurant to the user
        //       and go to the RecommendationsScreen and pass username:
      })
      .catch((error) => {
        console.error("Error generating restaurant:", error.message);
        Alert.alert(
          "Error",
          "Could not generate a recommendation. Please try again later."
        ); // Provide user feedback
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.formTitle}>Choose Your Dining Adventure!</Text>

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

        <View style={styles.preferencesContainer}>
          <TouchableOpacity
            style={[styles.symbolContainer, isVegan && styles.selectedSymbol]}
            onPress={() => setIsVegan(!isVegan)}
          >
            <Image
              source={require("../assets/symbols/veganfriendly.png")}
              style={styles.symbolImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.symbolContainer,
              isGlutenFree && styles.selectedSymbol,
            ]}
            onPress={() => setIsGlutenFree(!isGlutenFree)}
          >
            <Image
              source={require("../assets/symbols/glutenfree.png")}
              style={styles.symbolImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.symbolContainer,
              isWheelchairAccessible && styles.selectedSymbol,
            ]}
            onPress={() => setIsWheelchairAccessible(!isWheelchairAccessible)}
          >
            <Image
              source={require("../assets/symbols/wheelchairaccessibility.png")}
              style={styles.symbolImage}
            />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.container}>
              {/* Your existing content */}
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateRestaurant}
              >
                <Text style={styles.generateButtonText}>
                  ✨ Let's Start the Magic! ✨
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.beige,
  },
  innerContainer: {
    padding: 15,
  },
  formTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: COLORS.pink,
    textAlign: "center",
    marginBottom: 3,
    marginTop: 5,
  },
  pickerContainer: {
    marginTop: 10,
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
  preferencesContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: 10,
    justifyContent: "center",
  },
  symbolContainer: {
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderColor: COLORS.blue,
    borderWidth: 2,
  },
  symbolImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  selectedSymbol: {
    backgroundColor: COLORS.pink + "20",
    borderColor: COLORS.pink,
    borderWidth: 1,
  },
  generateButton: {
    backgroundColor: COLORS.pink,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
});
export default RestaurantPreferenceScreen;

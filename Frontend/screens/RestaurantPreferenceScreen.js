import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import OptionList from "../components/OptionList";
import {
  url,
  COLORS,
  restaurantTypes,
  budgets,
  atmospheres,
} from "../constants";
import { Picker } from "@react-native-picker/picker";

const RestaurantPreferenceScreen = () => {
  const route = useRoute();
  const { userId, userName } = route.params;
  const navigation = useNavigation();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(" ");
  const [selectedAtmosphere, setSelectedAtmosphere] = useState(" ");
  const [selectedDistrict, setSelectedDistrict] = useState(" ");
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
    const types = selectedTypes.map((item) => item.name);
    const atmosphere = selectedAtmosphere.name;

    navigation.replace("RecommendationsScreen", {
      userId,
      userName,
      selectedDistrict,
      selectedTypes: types,
      selectedBudget,
      selectedAtmosphere: atmosphere,
      isVegan,
      isGlutenFree,
      isWheelchairAccessible,
    });
  };

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "picker":
        return (
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

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
            >
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
        );
      case "optionList":
        return (
          <OptionList
            title={item.title}
            data={item.data}
            selectedItems={item.selectedItems}
            onToggle={item.onToggle}
            dataType={item.dataType}
          />
        );
      case "preferences":
        return (
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
        );
      case "button":
        return (
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateRestaurant}
          >
            <Text style={styles.generateButtonText}>
              ✨ Let's Start the Magic! ✨
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const data = [
    { type: "picker" },
    {
      type: "optionList",
      title: "Type of Restaurant",
      data: restaurantTypes,
      selectedItems: selectedTypes,
      onToggle: toggleType,
      dataType: "image",
    },
    {
      type: "optionList",
      title: "Budget",
      data: budgets,
      selectedItems: [selectedBudget],
      onToggle: selectBudget,
      dataType: "text",
    },
    {
      type: "optionList",
      title: "Atmosphere",
      data: atmospheres,
      selectedItems: [selectedAtmosphere],
      onToggle: selectAtmosphere,
      dataType: "image",
    },
    { type: "preferences" },
    { type: "button" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.beige }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
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
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
  },
  preferencesContainer: {
    flexDirection: "row",
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

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { COLORS } from "../colors";

const OptionList = ({ title, data, selectedItems, onToggle }) => {
  const renderOption = (item) => {
    const isSelected = selectedItems.includes(item);

    return (
      <TouchableOpacity
        key={item}
        style={[
          styles.typeBox,
          isSelected ? styles.selectedType : styles.unselectedType,
        ]}
        onPress={() => onToggle(item)}
      >
        <Text style={styles.typeText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => renderOption(item)}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Poppins_700Bold",
    color: COLORS.blue,
  },
  row: {
    justifyContent: "space-between",
  },
  typeBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 7,
    marginVertical: 5,
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    height: 55,
    backgroundColor: "#f9f9f9",
    elevation: 3,
    shadowColor: COLORS.blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  selectedType: {
    borderColor: COLORS.pink,
    backgroundColor: COLORS.pink + "20",
  },
  unselectedType: {
    borderColor: COLORS.blue,
  },
  typeText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
  },
});

export default OptionList;

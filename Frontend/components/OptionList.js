import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { COLORS } from "../colors";

const OptionList = ({ title, data, selectedItems, onToggle, dataType }) => {
  const renderOption = (item) => {
    const isSelected = selectedItems.includes(item);
  
    return (
      <TouchableOpacity
        key={item.name || item}
        style={[
          styles.typeBox,
          isSelected ? styles.selectedType : styles.unselectedType,
          { 
            height: dataType === 'image' ? 70 : 50, 
            width: title === "Atmosphere" || title === "Type of Restaurant"  ? 85 : 110 // Adjust the width for Atmosphere
          },
        ]}
        onPress={() => onToggle(item)}
      >
        {dataType === 'image' ? (
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
            {title !== "Atmosphere" && (
              <Text style={styles.typeText}>{item.name}</Text>
            )}
          </View>
        ) : (
          <Text style={[styles.typeText, { color: title === 'Budget' ? "#E9AE0B" : "black" },]}>{item}</Text>
        )}
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => renderOption(item)}
        keyExtractor={(item) => item.name || item}
        numColumns={"4"}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "Poppins_700Bold",
    color: COLORS.blue,
  },
  row: {
    justifyContent: "flex-start",

  },
  typeBox: {
    borderWidth: 2,
    borderRadius: 10,
    // padding: 3,
    marginHorizontal: 7,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: COLORS.blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backgroundColor: "#f9f9f9",
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
    opacity: 0.6,
    textAlign: 'center', 
    marginTop: 3, 

  },
  imageContainer: {
    alignItems: 'center', 
  },
  image: {
    width: 35, 
    height: 35, 
    resizeMode: "cover", 
  },
});

export default OptionList;

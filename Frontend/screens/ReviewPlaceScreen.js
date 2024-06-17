import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { COLORS } from "../colors";
import { FontAwesome5 } from "@expo/vector-icons"; 
import RatingInput from "../components/RatingInput"; 

import burgerFull from '../assets/symbols/burgerFull.png'; 
import burgerEmpty from '../assets/symbols/burgerEmpty.png'; 

import serviceFull from '../assets/symbols/serviceFull.png';
import serviceEmpty from '../assets/symbols/serviceEmpty.png'; 

import cleanlinessFull from '../assets/symbols/cleanlinessFull.png'; 
import cleanlinessEmpty from '../assets/symbols/cleanlinessEmpty.png'; 

import vibesFull from '../assets/symbols/vibesFull.png'; 
import vibesEmpty from '../assets/symbols/vibesEmpty.png'; 

function ReviewPlaceScreen({ route }) {
  const { data } = route.params;
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [vibesRating, setVibesRating] = useState(0);
  const [additionalComments, setAdditionalComments] = useState("");

  const handleSubmitButton = () => {
    // Send ratings to backend
    const ratings = {
      foodRating,
      serviceRating,
      cleanlinessRating,
      vibesRating,
      additionalComments,
    };
    console.log("Ratings submitted:", ratings);
    alert("Thank you for your review!");

  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
              How was your experience at {data.name}? Share with us! 🌟
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.label}>Food:</Text>
              <RatingInput
                rating={foodRating}
                setRating={setFoodRating}
                fullImage={burgerFull}
                emptyImage={burgerEmpty}
              />
              <Text style={styles.label}>Service:</Text>
              <RatingInput
                rating={serviceRating}
                setRating={setServiceRating}
                fullImage={serviceFull}
                emptyImage={serviceEmpty}
              />
              <Text style={styles.label}>Cleanliness:</Text>
              <RatingInput
                rating={cleanlinessRating}
                setRating={setCleanlinessRating}
                fullImage={cleanlinessFull}
                emptyImage={cleanlinessEmpty}
              />
              <Text style={styles.label}>Vibes:</Text>
              <RatingInput
                rating={vibesRating}
                setRating={setVibesRating}
                fullImage={vibesFull}
                emptyImage={vibesEmpty}
              />
              <Text style={styles.label}>Additional Comments:</Text>
              <TextInput
                style={styles.textInput}
                editable
                multiline
                numberOfLines={8}
                maxLength={200}
                onChangeText={setAdditionalComments}
                value={additionalComments}
                placeholder={"Share your experience here! 💬"}
                placeholderTextColor={COLORS.blue} 
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitButton}
            >
              <Text style={styles.buttonText}>Submit Review <FontAwesome5 name="paper-plane" size={18} color={COLORS.white} /></Text>
              </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, 
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    color: COLORS.blue, 
  },
  ratingContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: COLORS.black, 
  },
  textInput: {
    borderColor: COLORS.pink, 
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
    backgroundColor: COLORS.beige,
    height: 100, // Ensures the TextInput is large enough for multiple lines
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 20,
    backgroundColor: COLORS.blue,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.white,
  },
});

export default ReviewPlaceScreen;

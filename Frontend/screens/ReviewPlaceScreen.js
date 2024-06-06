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
} from "react-native";
import { RatingInput } from "react-native-stock-star-rating";
import { COLORS } from "../colors";

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
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              What Was Your Experience Like at {data.name}? Share With Us!
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Food:</Text>
            <RatingInput
              rating={foodRating}
              setRating={setFoodRating}
              size={35}
              maxStars={5}
              bordered={false}
            />
            <Text style={styles.label}>Service:</Text>
            <RatingInput
              rating={serviceRating}
              setRating={setServiceRating}
              size={35}
              maxStars={5}
              bordered={false}
            />
            <Text style={styles.label}>Cleanliness:</Text>
            <RatingInput
              rating={cleanlinessRating}
              setRating={setCleanlinessRating}
              size={35}
              maxStars={5}
              bordered={false}
            />
            <Text style={styles.label}>Vibes:</Text>
            <RatingInput
              rating={vibesRating}
              setRating={setVibesRating}
              size={35}
              maxStars={5}
              bordered={false}
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
              placeholder={"Share your experience here!"}
              placeholderTextColor={COLORS.blue} // Placeholder color changed to blue
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmitButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Changed background color to white
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontFamily: "Cochin",
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.black, // Changed text color to pink
  },
  ratingContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: "Cochin",
    fontWeight: "bold",
    color: COLORS.black, // Changed text color to pink
  },
  textInput: {
    borderColor: COLORS.pink, // Border color changed to pink
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
    backgroundColor: COLORS.white,
    lineHeight: 60,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 20,
    backgroundColor: COLORS.blue,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.white,
  },
});

export default ReviewPlaceScreen;

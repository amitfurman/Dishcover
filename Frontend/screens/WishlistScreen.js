import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import WishlistCard from "../components/WishlistCard";
import WishlistCardBack from "../components/WishlistCardBack";
import axios from "axios";
import { COLORS } from "../constants";
import { url } from "../constants";

function WishlistScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, userName } = route.params;
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/api/users/getPlacesUserWantToVisit?userName=${userName}`
      );
      setRestaurants(response.data.placesToVisit);
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
      Alert.alert(
        "An error occurred while fetching your wishlist. Please try again."
      );
    }
  }, [userName]);

  useFocusEffect(
    useCallback(() => {
      fetchRestaurants();
    }, [fetchRestaurants])
  );

  const handlePressOnCard = (item) => {
    const details = {
      name: item.name,
      rating: item.rating,
      location: item.city,
      priceLevel: item.priceLevel,
      images: item.images,
      menuLink: item.menuLink,
      description: item.description,
      openingHours: item.openingHours,
      rankingString: item.rankingString,
      type: item.type,
    };
    setSelectedCard(details);
    setCardModalVisible(true);
  };

  const closeCardModal = () => {
    setCardModalVisible(false);
    setSelectedCard(null);
  };

  const onTrashPress = (item) => {
    setCurrentRestaurant(item);
    setModalMessage(
      `Are you sure you want to delete ${item.name} from your wishlist?`
    );
    setDeleteModalVisible(true);
  };

  const handleDeleteRestaurant = async () => {
    setDeleteModalVisible(false);

    try {
      // Prepare data for backend
      const reviewData = {
        userName: userName,
        restaurantName: currentRestaurant.name,
      };

      // Perform the delete request
      await axios.delete(`${url}/api/users/deleteRestaurantFromPlacesToVisit`, {
        data: reviewData,
      });

      fetchRestaurants();
      // Proceed to review modal
      setModalMessage(
        `${currentRestaurant.name} removed from your wishlist!\nVisited? Share your experience to get personalized recommendations like this one!`
      );
      setReviewModalVisible(true);
    } catch (error) {
      console.error("Error delete Restaurant:", error.message);
      Alert.alert(
        "An error occurred while updating your wishlist. Please try again."
      );
    }
  };

  const handleReviewResponse = async (response) => {
    setReviewModalVisible(false);

    if (response) {
      // Only proceed if the user has visited the restaurant
      try {
        await axios.post(`${url}/api/users/placesUserVisited`, {
          userName: userName,
          placesVisited: [currentRestaurant.name],
        });

        // Navigate to the review screen if the user wants to leave a review
        navigation.navigate("ReviewPlaceScreen", {
          userId: userId,
          userName: userName,
          restaurantName: currentRestaurant.name,
        });
      } catch (error) {
        console.error("Error submitting review:", error.message);
        Alert.alert(
          "An error occurred while submitting your review. Please try again."
        );
      }
    } else {
      console.log("User chose not to submit a review.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Your Wishlist</Text>
      {restaurants.length === 0 ? (
        <Text style={styles.emptyMessage}>
          Your wishlist is currently empty. {"\n"} Start exploring and add some
          places you want to visit!
        </Text>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <WishlistCard
                name={item.name}
                image={item.mainImage}
                onPress={() => handlePressOnCard(item)}
              />
              <TouchableOpacity
                onPress={() => onTrashPress(item)}
                style={styles.trashIcon}
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={28}
                  color={COLORS.pink}
                />
              </TouchableOpacity>
            </View>
          )}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
        />
      )}
      <WishlistCardBack
        visible={isCardModalVisible}
        onClose={closeCardModal}
        details={selectedCard}
      />
      {isDeleteModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDeleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteRestaurant}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {isReviewModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isReviewModalVisible}
          onRequestClose={() => setReviewModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => handleReviewResponse(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleReviewResponse(true)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
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
    marginTop: 50,
  },
  flatListContent: {
    justifyContent: "center",
  },
  cardWrapper: {
    flex: 1,
    margin: 10,
    maxWidth: "45%",
    position: "relative",
    backgroundColor: COLORS.beige,
  },
  trashIcon: {
    position: "absolute",
    top: -12,
    right: -13,
    zIndex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontFamily: "Poppins_500Medium_Italic",
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.blue,
    textAlign: "center", // Center horizontally
    alignSelf: "center", // Center horizontally within the container
  },
  modalButton: {
    backgroundColor: COLORS.pink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyMessage: {
    textAlign: "center",
    color: COLORS.blue,
    fontSize: 18,
    marginTop: 20,
    fontFamily: "Poppins_500Medium_Italic",
  },
});

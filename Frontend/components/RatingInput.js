import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const RatingInput = ({ rating, setRating, fullImage, emptyImage, maxRating = 5 }) => {
  const handleRatingChange = (value) => {
    setRating(value);
  };

  const renderIcons = () => {
    const icons = [];
    for (let i = 1; i <= maxRating; i++) {
      icons.push(
        <TouchableOpacity key={i} onPress={() => handleRatingChange(i)}>
          <Image
            source={rating >= i ? fullImage : emptyImage}
            style={styles.icon}
          />
        </TouchableOpacity>
      );
    }
    return icons;
  };

  return <View style={styles.ratingContainer}>{renderIcons()}</View>;
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    margin: 5,
  },
});

export default RatingInput;

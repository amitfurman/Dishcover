import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const StarRating = ({ rating }) => {
    const roundedRating = Math.round(rating * 2) / 2; // Round to the nearest half

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= roundedRating) {
            stars.push(
                <FontAwesome
                    key={i}
                    name="star"
                    size={20}
                    color="gold"
                    style={{ marginHorizontal: 2 }}
                />
            );
        } else if (i - 0.5 <= roundedRating) {
            stars.push(
                <FontAwesome
                    key={i}
                    name="star-half-full"
                    size={20}
                    color="gold"
                    style={{ marginHorizontal: 2 }}
                />
            );
        } else {
            stars.push(
                <FontAwesome
                    key={i}
                    name="star-o"
                    size={20}
                    color="gold"
                    style={{ marginHorizontal: 2 }}
                />
            );
        }
    }

    return <View style={styles.starContainer}>{stars}</View>;
};

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default StarRating;

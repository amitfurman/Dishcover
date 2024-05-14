import { View, Text, TextInput, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { restaurants as restaurantsArray} from '../data';
import Card from '../components/Card';
export default function SwipeRestaurants() {
    const [restaurants, setRestaurants] = useState(restaurantsArray);

    useEffect(() => {
        if (!restaurants.length) {
            setRestaurants(restaurantsArray);
        }
    }, [restaurants.length]);
    return (
        <View className="h-full w-full flex justify-around pt-40 pb-10">
            <StatusBar style="auto" />
            {
                restaurants.map((restaurant, index) => {
                    const isFirst = index == 0;
                    return (
                        <Card
                            key={restaurant.name}
                            name={restaurant.name}
                            rating={restaurant.rating}
                            location={restaurant.location}
                            image={restaurant.image}
                            isFirst={isFirst}
                        />
                    );
                })
            }
            <Card />
        </View>
    );
}

import { View, Text, Animated, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const Button = ({name, size, color, style, onPress}) => {
    const scale = useRef(new Animated.Value(1)).current;
    
    const animatedScale = useCallback((newValue) => {
        Animated.spring(scale, {
            toValue: newValue,
            useNativeDriver: true,
            triction: 4,
        }).start();
    }
    , [scale]);

    return (
        <TouchableWithoutFeedback 
        onPressIn={() => animatedScale(0.6)}
        onPressOut={() => animatedScale(1)}
        delayPressIn={0}
        delayPressOut={100}
        onPress={onPress}
        
        >
            <Animated.View style={{
                width: 60,
                height: 60,
                borderRadius: 40,
                elevation: 5,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                borderColor: color,
                borderWidth: 1.2,
                transform: [{ scale }],
                ...style,
            }
            }>
                <FontAwesome name={name} size={size} color={color} />
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

export default Button
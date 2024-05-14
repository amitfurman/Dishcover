import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native'
import React, { Fragment, useCallback } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Choice from './Choice';

const {width, height} = Dimensions.get("screen");

const Card = ({ name, rating, location, image, isFirst, swipe, titleSign, ...rest }) => {
    const rotate = Animated.multiply(swipe.x, titleSign).interpolate({
        inputRange: [-width, 0, width],
        outputRange: ["10deg", "0deg", "-10deg"],
    });

    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(),{ rotate }]
    };

    const likeOpacity = swipe.x.interpolate({
        inputRange: [0, width / 2],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const nopeOpacity = swipe.x.interpolate({
        inputRange: [-width / 2, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const renderChoice = useCallback(() => {
        return (
            <Fragment>
                <Animated.View style={[styles.choiceContainer, styles.likeContainer, {opacity: likeOpacity}]}>
                    <Choice type="like" />
                </Animated.View>
                <Animated.View style={[styles.choiceContainer, styles.nopeContainer, {opacity: nopeOpacity}]}>
                    <Choice type="nope" />
                </Animated.View>
            </Fragment>
        );
    }, [likeOpacity, nopeOpacity])

    return (
      <Animated.View style={[styles.container,
        isFirst && animatedCardStyle,
      ]}{...rest} >
          <Image source={image} style={styles.image}/>
          <LinearGradient colors={['transparent', 'black']} style={styles.gradient}>
              <View style={styles.restaurantContainer} >
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.rating}>{rating}</Text>
                  <Text style={styles.location}>{location}</Text>
              </View>
          </LinearGradient>
        {isFirst && renderChoice()}
      </Animated.View>
    );
  };
  

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        position: 'absolute',
        top: 30,
    },
    image: {
        width: width * 0.9,
        height: height * 0.6,
        borderRadius: 20,
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    restaurantContainer: {
        position: 'absolute',
        bottom: 25,
        left: 25,
    },
    name: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    rating: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    location: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    choiceContainer: {
        position: 'absolute',
        top: 100,
        zIndex: 999,
    },
    likeContainer: {
        right: 20,
        transform: [{ rotate: '30deg' }],
    },
    nopeContainer: {
        left: 20,
        transform: [{ rotate: '-30deg' }],
    },  

})
export default Card
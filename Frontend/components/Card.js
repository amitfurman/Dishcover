import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native'
import React, { Fragment, useCallback } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Choice from './Choice';
import StarRating from './StarRating'; // Import StarRating


const {width, height} = Dimensions.get("screen");

const Card = ({ name, rating, location, priceLevel, image, isFirst, swipe, titleSign,  isVeganFriendly, isWheelchairAccessible,isGlutenFree, ...rest }) => {
    const rotate = Animated.multiply(swipe.x, titleSign).interpolate({
        inputRange: [-width, 0, width],
        outputRange: ["10deg", "0deg", "-10deg"],
    });

    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(),{ rotate }]
    };

    const likeOpacity = swipe.x.interpolate({
        inputRange: [0, 100], /////////
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const nopeOpacity = swipe.x.interpolate({
        inputRange: [-100, 0], ////////////
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
        <Animated.View style={[styles.container, isFirst && animatedCardStyle]} {...rest}>
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 1)']}
              style={styles.imageGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
            />
          </View>
          <View style={styles.symbolsContainer}>
                {isVeganFriendly && (
                <View style={styles.symbol}>
                    <Image source={require('../assets/symbols/veganfriendly.png')} style={styles.symbolImage} />
                </View>
                )}
                {isWheelchairAccessible && (
                <View style={styles.symbol}>
                    <Image source={require('../assets/symbols/wheelchairaccessibility.png')} style={styles.symbolImage} />
                </View>
                )}
                {isGlutenFree && (
                <View style={styles.symbol}>
                    <Image source={require('../assets/symbols/glutenfree.png')} style={styles.symbolImage} />
                </View>
                )}
          </View>
        <LinearGradient 
            colors={['transparent', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)']} 
            style={styles.gradient} 
            start={{ x: 0, y: 0.5 }} 
            end={{ x: 0, y: 1 }}
        />
        <View style={styles.infoContainer}>
            <View style={styles.restaurantContainer}>
            <View style={styles.nameRatingContainer}>
                <Text style={styles.name}>{name}</Text>
                <StarRating rating={rating} />
            </View>
            <Text style={styles.priceLevel}>{priceLevel}</Text>
            <Text style={styles.location}>{location}</Text>
            </View>
        </View>
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
        top: 100,
        // paddingBottom: 80,
        backgroundColor: 'white',
    },
    imageContainer: {
        overflow: 'hidden',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    image: {
        width: width * 0.9,
        height: height * 0.7,
        resizeMode: 'cover',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
      },
    gradient: {
        position: 'absolute',
        // bottom: 100,
        // left: 0,
        // right: 0,
        height: '50%',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingTop: 100,
        paddingBottom: 50
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%',
        justifyContent: 'flex-end',
        },
    restaurantContainer: {
        position: 'absolute',
        bottom: 10,
        left: 25,
        paddingHorizontal: 10, // Adjust as needed
        paddingVertical: 5, // Adjust as needed
        borderRadius: 10, // Adjust as needed
        
    },
    nameRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontFamily: 'Bricolage-Bold',
        color: 'black',
        fontSize: 24,
        marginRight: 10,
    },    
    priceLevel: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Bricolage-Medium',
        marginLeft: 10,
        marginTop: 5,
    },
    location: {
        color: 'gray',
        fontSize: 16,
        fontFamily: 'Bricolage-Medium',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    choiceContainer: {
        position: 'absolute',
        top: 50,
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
    symbolsContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 30,
        padding: 5,
      },
      symbol: {
        // marginRight: 5,
      },
      symbolImage: {
        width: 30,
        height: 30,
      },
})
export default Card
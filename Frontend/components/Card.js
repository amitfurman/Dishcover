import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native'
import React, { Fragment, useCallback } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Choice from './Choice';
import StarRating from './StarRating'; // Import StarRating


const {width, height} = Dimensions.get("screen");

const Card = ({ name, rating, location, priceLevel, image, isFirst, swipe, titleSign,  isVeganFriendly, isWheelchairAccessible,isGlutenFree,type, ...rest }) => {
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
            <StarRating rating={rating} />

            <View style={styles.nameRatingContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.name}>{location}</Text>
            </View>
            <View style={styles.priceTypeContainer}>
                <Text style={styles.priceLevel}>{priceLevel}</Text>
                <Text style={styles.type}>{type}</Text>
                {/* <StarRating rating={rating} /> */}
            </View>
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
        paddingBottom: 90,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    imageContainer: {
        overflow: 'hidden',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // borderBottomRightRadius: 20,
        // borderBottomLeftRadius: 20,
    },
    image: {
        width: width * 0.9,
        height: height * 0.6,
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
        top: 215,
        // bottom: 0,
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
    priceTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontFamily: 'Poppins_700Bold',
        color: 'black',
        fontSize: 24,
        marginRight: 5,
    },    
    separator: {
        fontFamily: 'Poppins_700Bold',
        color: 'black',
        fontSize: 24,
        marginHorizontal: 5,
    },
    priceLevel: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Roboto_500Medium',
        marginRight: 10,
    },
    dot: {
        color: 'black',
        fontSize: 20,
        marginHorizontal: 5,
    },
    location: {
        color: 'gray',
        fontSize: 16,
        fontFamily: 'PlayfairDisplay_600SemiBold',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    type: {
        color: 'gray',
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        marginVertical: 5,
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
        // paddingLeft: 5,
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
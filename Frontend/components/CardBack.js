// CardBack.js
import { View, Text, StyleSheet, Image, Dimensions,Animated, Linking} from 'react-native';
import React, { Fragment, useCallback } from 'react'
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import {GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Choice from './Choice';
import Carousel from 'react-native-reanimated-carousel';


const {width, height} = Dimensions.get("screen");

const CardBack = ({ 
    name, 
    rating, 
    location, 
    priceLevel, 
    images, 
    menuLink, 
    description, 
    openingHours, 
    rankingString, 
    isFirst, 
    swipe, 
    titleSign,  
    type, 
    ...rest }) => {
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

    const renderItem = ({ item, index }) => (
      <View key={index} style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    );
  
    return (
        <GestureHandlerRootView>
            <Animated.View style={[styles.card, isFirst && animatedCardStyle]} {...rest}>
            <View style={styles.infoContainer}>
              <View style={styles.contentContainer}>
                  <View style={styles.Container}>
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.location}>{location}</Text>
                  <Text style={styles.rankingString}>{rankingString}</Text>
                  <View style={styles.carouselContainer}>
                          <Carousel
                              loop
                              width={width * 0.8}
                              height={height * 0.25}
                              autoPlay
                              autoPlayInterval={3000}
                              data={images}
                              renderItem={renderItem}                    
                          />
                    </View>
                    <Text style={styles.description}>{description}</Text>
                  </View>
                  <View style={styles.openingHoursContainer}>
                    <Text style={styles.openingHoursTitle}>Opening Hours</Text>
                    <View style={styles.openingHoursTextContainer}>
                        {openingHours.split(', ').map((slot, index) => {
                            // Split each time slot into day and time
                            const [day, time] = slot.split(': ');
                            return (
                                <Text key={index} style={styles.openingHoursText}>
                                    <Text style={styles.day}>{day}</Text>: <Text style={styles.time}>{time}</Text>
                                </Text>
                            );
                        })}
                    </View>
                  </View>

              </View>
              <View style={styles.priceTypeContainer}>
                  <Text style={styles.priceLevel}>{priceLevel}</Text>
                  <Text style={styles.type}>{type}</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(menuLink)} style={styles.menuLink}>
                      <Image source={require('../assets/symbols/menu.png')} style={styles.icon} />
                      <MaterialCommunityIcons name="arrow-top-right" size={24} color="#4900D9" />
                  </TouchableOpacity>
              </View>        
            </View>

            {isFirst && renderChoice()}
            </Animated.View>
        </GestureHandlerRootView>
      );
    };

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    // position: 'absolute',
    // top: 100,
    // paddingBottom: 90,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "#f9f2eb",
    width: width * 0.9,
    height: height * 0.7,
    position: 'relative',
    flex: 1,
},
Container: {
  flex: 1,
},
infoContainer: {
    padding: 15,
    alignItems: 'center',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins_700Bold',
    color: '#010057',
    fontSize: 26,
    textAlign: 'center',
  },
  location: {
    fontFamily: 'Poppins_400Regular',
    color: '#FF5959',
    fontSize: 16,
    textAlign: 'center',
  },
  carouselContainer: {
    width: width * 0.8,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  navigationButton: {
    position: 'absolute',
    top: '50%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    zIndex: 1,
},
navigationButtonText: {
    color: 'white',
},
  imageContainer: {
    width: width * 0.8,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden'
},
  image: {
    width: width * 0.8,
    height: height * 0.25,
    resizeMode: 'cover',
    borderRadius: 10,

  },
  menuLink: {
    alignSelf: 'flex-start',
    // marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  priceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    // position: 'absolute',
    // bottom: -60, // Adjust this value as needed
    // zIndex: 1, // Ensure it's above other content
  },
  
  priceLevel: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 20,
    flex: 1, 
  },
  type: {
    color: 'gray',
    fontSize: 18,
    fontFamily: 'Roboto_400Regular',
    flex: 1,
  },
description: {
  fontFamily: 'Poppins_400Regular',
  color: '#333',
  fontSize: 15, 
  lineHeight: 22, 
  textAlign: 'center',
},
openingHoursTitle: {
  fontFamily: 'Poppins_600SemiBold',
  fontSize: 20,
  marginBottom: 5,
  color: '#FF5959',
  marginLeft: 10,
},
day: {
  color: '#010057', // Change the color as desired
  fontFamily: 'Poppins_600SemiBold_Italic',
  fontSize: 16,
},
time: {
  fontFamily: 'Poppins_400Regular',
  fontSize: 16,
},
openingHoursContainer: {
  height: 130,
},
openingHoursText: {
  lineHeight: 20, 
},
openingHoursTextContainer: {
  marginLeft: 20,
},
  rankingString: {
    fontFamily: 'Poppins_300Light_Italic',
    color: 'gray',
    marginBottom: 10,
    textAlign: 'center',
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
icon: {
    width: 40,
    height: 40,},
});

export default CardBack;

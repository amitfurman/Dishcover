import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

const {width, height} = Dimensions.get("screen");

const Card = ({ name, rating, location, image, isFirst }) => {
    return (
      <View style={styles.container} >
          <Image source={image} style={styles.image}/>
          <LinearGradient colors={['transparent', 'black']} style={styles.gradient}>
              <View style={styles.userContainer} >
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.rating}>{rating}</Text>
                  <Text style={styles.location}>{location}</Text>
              </View>
          </LinearGradient>
      </View>
    );
  };
  

const styles = StyleSheet.create({
    container: {
        width: width - 40,
        height: height / 2,
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    image: {
        width: width * 0.9,
        height: height * 0.6,
        borderRadius: 20,
        resizeMode: 'cover',
    },
    gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'flex-end',
        padding: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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

})
export default Card
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const HomePageButton = ({ text, textColor, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  text: {
    fontSize: 22,
  },
});

export default HomePageButton;

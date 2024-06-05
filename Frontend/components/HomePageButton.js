import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const HomePageButton = ({ text, textColor, backgroundColor, borderColor, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor }]}
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
    borderWidth: 1.2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  text: {
    fontSize: 22,
  },
});

export default HomePageButton;

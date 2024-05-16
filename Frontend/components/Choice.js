import { View, Text } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons';

const COLORS = {
    like: "#00eda6",
    nope: "#ff006f",
}

const Choice = ({type}) => {
  let icon = null;
  if (type === 'like') {
    icon = <Octicons name="check" size={50} color={COLORS[type]} />;
  } else if (type === 'nope') {
    icon =  <Octicons name="x" size={50} color={COLORS[type]} />;
  }

  return (
    <View style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        borderColor: COLORS[type],
        borderWidth: 5,
    
    }}>
      {icon}
      {/* <Text style= {{
            color: COLORS[type],
            fontSize: 32,
            fontWeight: 'bold',
            letterSpacing: 1.5,
      }}>{{icon}}</Text> */}
    </View>
  )
}

export default Choice
import { View, Text } from 'react-native'
import React from 'react'

const COLORS = {
    like: "00eda6",
    nope: "ff006f",
}

const Choice = ({type}) => {
  return (
    <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        borderColor: COLORS[type],
        borderWidth: 5,
    
    }}>
      <Text style= {{
            color: COLORS[type],
            fontSize: 32,
            fontWeight: 'bold',
            letterSpacing: 1.5,
      }}>{type}</Text>
    </View>
  )
}

export default Choice
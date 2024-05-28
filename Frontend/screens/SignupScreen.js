import { View, Text, TextInput, TouchableOpacity,StyleSheet } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames';
import { Octicons } from '@expo/vector-icons';

export default function SignupScreen() {

  return (    
    <View className="h-full w-full flex justify-around pt-40 pb-10">
        <View className="flex items-center justify-center">
            <Text style={styles.createAcountText}>
                Create an account
            </Text>
        </View>
        {/* form */}
        <View className="flex items-center mx-4 space-y-4">
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-3 flex-row">
            <Octicons name="person" size={18} color="gray" style={{ marginRight: 10 }} />
                <TextInput placeholder="User Name"  placeholderTextColor={"gray"}  className="flex-1" />
            </View>
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-3 flex-row">
                <Octicons name="mail" size={18} color="gray" style={{ marginRight: 10 }} />
                <TextInput  placeholder="Email " placeholderTextColor={"gray"} className="flex-1" />
            </View>
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-3 flex-row">
                <Octicons name="lock" size={18} color="gray" style={{ marginRight: 10 }} />
                <TextInput placeholder="Password"  placeholderTextColor={"gray"} secureTextEntry className="flex-1" />
            </View>
            <View className="w-full">
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    button: {
      width: '100%',
      padding: 12, // converted p-3 to 12 for padding in React Native
      borderRadius: 20, // rounded-2xl roughly converts to 20 in React Native
      backgroundColor: '#FF5959',
      marginBottom: 12, // mb-3 converts to 12 for margin in React Native
    },
    buttonText: {
        fontSize: 18, // text-lg converts to 18 in React Native
        textAlign: 'center',
        color: '#f8f7f4', // assuming you want white text for contrast
    },
    createAcountText: {
        fontSize: 30, // text-2xl converts to 24 in React Native
        fontWeight: 'bold', // font-bold converts to bold in React Native
        color: '#FF5959',
    },
  });
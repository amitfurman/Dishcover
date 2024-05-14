import { View, Text, TextInput, TouchableOpacity} from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer, useNavigation } from '@react-navigation/native'; // Import useNavigation hook



export default function SigninScreen() {
    const navigation = useNavigation(); // useNavigation hook here

  return (
<View className="h-full w-full flex justify-around pt-40 pb-10">
        <View className="flex items-center justify-center">
            <Text className="text-2xl font-bold trackimg-wider text-orange-300 mb-2">
                Welcome Back!
            </Text>
            <Text className="text-xl font-light trackimg-wider text-black-200">
                We're so excited to see you again!
            </Text>
        </View>
        {/* form */}
        <View className="flex items-center mx-4 space-y-4">
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-3 flex-row">
                <TextInput  placeholder="Email or username " placeholderTextColor={"gray"} className="flex-1" />
            </View>
            <View className="bg-black/5 p-5 rounded-2xl w-full flex-row">
                <TextInput placeholder="Password"  placeholderTextColor={"gray"} secureTextEntry className="flex-1" />
            </View>
            <TouchableOpacity className="self-start mb-4" >
                <Text className="text-orange-300 text-left ">Forgot Password?</Text>
            </TouchableOpacity>
            <View className="w-full">
                <TouchableOpacity className="w-full p-3 rounded-2xl mb-3 bg-orange-300">
                    <Text className="text-xl font-bold text-center">Sign In</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-center">
                <Text className="text-gray-500">Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text className="text-orange-300"> Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}
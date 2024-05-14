import { View, Text, TextInput, TouchableOpacity} from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames';
import { Octicons } from '@expo/vector-icons';

export default function SignupScreen() {

  return (    
    <View className="h-full w-full flex justify-around pt-40 pb-10">
        <View className="flex items-center justify-center">
            <Text className="text-2xl font-bold trackimg-wider text-orange-300">
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
                <TouchableOpacity className="w-full p-3 rounded-2xl mb-3 bg-orange-300">
                    <Text className="text-xl font-bold text-center">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}
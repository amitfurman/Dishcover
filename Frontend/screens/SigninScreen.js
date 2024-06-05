import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { React, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import { API_BASE_URL } from "@env";

export default function SigninScreen() {
  const navigation = useNavigation(); // useNavigation hook here
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSignin() {
    const userData = {
      id: id,
      password: password,
    };

    if (id.length != 0 && password.length != 0) {
      axios.post(`${API_BASE_URL}/signin`, userData).then((res) => {
        if (res.data.status === "ok") {
          Alert.alert("User logged in successfully");
          ////////////////add navigation to the next screen
          navigation.navigate("FirstIntro");
        } else {
          Alert.alert(res.data.data);
        }
      });
    } else {
      Alert.alert("Please fill all the mandatory details");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            <TextInput
              placeholder="Email or username "
              placeholderTextColor={"gray"}
              className="flex-1"
              onChange={(e) => setId(e.nativeEvent.text)}
            />
          </View>
          <View className="bg-black/5 p-5 rounded-2xl w-full flex-row">
            <TextInput
              placeholder="Password"
              placeholderTextColor={"gray"}
              className="flex-1"
              onChange={(e) => setPassword(e.nativeEvent.text)}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : !showPassword ? (
                <Feather name="eye-off" size={20} style={{ color: "green" }} />
              ) : (
                <Feather name="eye" size={20} style={{ color: "green" }} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="self-start mb-4">
            <Text className="text-orange-300 text-left ">Forgot Password?</Text>
          </TouchableOpacity>
          <View className="w-full">
            <TouchableOpacity
              className="w-full p-3 rounded-2xl mb-3 bg-orange-300"
              onPress={() => handleSignin()}
            >
              <Text className="text-xl font-bold text-center">Sign In</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text className="text-gray-500">Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text className="text-orange-300"> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

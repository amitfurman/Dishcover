import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { React, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import tw from "tailwind-react-native-classnames";
import { Octicons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import Error from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import {COLORS} from '../colors';

export default function SignupScreen({ props }) {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [nameVerified, setNameVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSignup() {
    const userData = {
      name: name,
      email,
      password,
    };

    if (nameVerified && emailVerified && passwordVerified) {
      axios
        .post("http://10.100.102.4:3000/signup", userData)
        .then((res) => {
          if (res.data.status === "ok") {
            Alert.alert("User created successfully");
            navigation.navigate("FirstIntro");
          } else {
            Alert.alert(res.data.data);
          }
        })
        .catch((e) => console.log(e.message));
    } else {
      Alert.alert("Please fill all the mandatory details");
    }
  }

  function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerified(false);

    if (nameVar.length > 1) {
      setNameVerified(true);
    }
  }

  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerified(false);

    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerified(true);
    }
  }

  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerified(false);

    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerified(true);
    }
  }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ backgroundColor: '#f9f2eb', height: '100%', width: '100%', flex: 1, justifyContent: 'space-around', paddingTop: 40, paddingBottom: 10 }}>
        <View className="flex items-center justify-center">
          <Text style={styles.createAcountText}>Create an account</Text>
        </View>
        {/* form */}
        <View className="flex items-center mx-4 space-y-4">
          <View className="bg-black/5 p-5 rounded-2xl w-full mb-3 flex-row">
            <Octicons
              name="person"
              size={18}
              color="gray"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="User Name"
              placeholderTextColor={"gray"}
              className="flex-1"
              onChange={(e) => handleName(e)}
            />
            {name.length < 1 ? null : nameVerified ? (
              <Feather
                name="check-circle"
                size={20}
                style={{ color: "green" }}
              />
            ) : (
              <Error name="error" size={20} style={{ color: "red" }} />
            )}
          </View>
          {name.length < 1 ? null : nameVerified ? null : (
            <Text
              style={{
                color: "red",
                fontSize: 12,
              }}
            >
              Name should be more than 1 character
            </Text>
          )}
          <View className="bg-black/5 p-5 rounded-2xl w-full mb-3 flex-row">
            <Octicons
              name="mail"
              size={18}
              color="gray"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Email "
              placeholderTextColor={"gray"}
              className="flex-1"
              onChange={(e) => handleEmail(e)}
            />
            {email.length < 1 ? null : emailVerified ? (
              <Feather
                name="check-circle"
                size={20}
                style={{ color: "green" }}
              />
            ) : (
              <Error name="error" size={20} style={{ color: "red" }} />
            )}
          </View>
          {email.length < 1 ? null : emailVerified ? null : (
            <Text
              style={{
                color: "red",
                fontSize: 12,
              }}
            >
              Enter proper Email address
            </Text>
          )}

          <View className="bg-black/5 p-5 rounded-2xl w-full mb-3 flex-row">
            <Octicons
              name="lock"
              size={18}
              color="gray"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={"gray"}
              className="flex-1"
              onChange={(e) => handlePassword(e)}
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
          <View className="w-full">
            {password.length < 1 ? null : passwordVerified ? null : (
              <Text
                style={{
                  color: "red",
                  fontSize: 12,
                }}
              >
                Uppercase, Lowercase, Number and min 6 characters
              </Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSignup()}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 12, // converted p-3 to 12 for padding in React Native
    borderRadius: 20, // rounded-2xl roughly converts to 20 in React Native
    backgroundColor: COLORS.blue,
    marginBottom: 12, // mb-3 converts to 12 for margin in React Native
  },
  buttonText: {
    fontSize: 18, // text-lg converts to 18 in React Native
    textAlign: "center",
    color: "#f8f7f4", // assuming you want white text for contrast
  },
  createAcountText: {
    fontSize: 30, // text-2xl converts to 24 in React Native
    fontWeight: "bold", // font-bold converts to bold in React Native
    color: COLORS.pink, // assuming you want blue text for contrast
  },
});

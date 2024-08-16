import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from "react-native";
import { React, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import tw from "tailwind-react-native-classnames";
import { Octicons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import Error from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { COLORS } from "../constants";
import { url } from "../constants";

export default function SignupScreen({ props }) {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [nameVerified, setNameVerified] = useState(false);
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  function handleSignup() {
    console.log("Signing up user with data:", name, email, password);
    const userData = {
      name,
      email,
      password,
    };

    if (nameVerified && emailVerified && passwordVerified) {
      axios
        .post(`${url}/api/users/signup`, userData)
        .then((res) => {
          if (res.data.status === "ok") {
            setModalMessage("User created successfully");
            setModalVisible(true);
            setTimeout(() => {
              setModalVisible(false);
              navigation.navigate("FirstIntro", { username: name });
            }, 2000);
          } else {
            setModalMessage(res.data.data);
            setModalVisible(true);
          }
        })
        .catch((e) => {
          setModalMessage(e.message);
          setModalVisible(true);
        });
    } else {
      setModalMessage("⚠️ Please fill all the mandatory details");
      setModalVisible(true);
    }
  }

  function checkIfNameValid(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerified(false);

    if (nameVar.length > 1) {
      setNameVerified(true);
    } else {
      setNameError("Oops! Your name should be longer than one character");
    }
  }

  function checkIfNameExists() {
    console.log("Checking if name exists in the database");

    // Check if the name already exists in the database
    axios
      .get(`${url}/api/users/checkUserByName?name=${name}`)
      .then((res) => {
        if (res.data.exists) {
          // Name already exists in the database
          setNameVerified(false);
          setNameError("😅 Username already taken. Try another one!");
        }
      })
      .catch((error) => {
        console.log("Error checking name. Please try again. ", error.message);
      });
  }

  function checkIfEmailValid(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerified(false);

    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerified(true);
    } else {
      setEmailError("Enter a valid email address");
    }
  }

  function checkIfEmailExists() {
    console.log("Checking if email exists in the database");
    // Check if the email already exists in the database

    axios
      .get(`${url}/api/users/checkUserByEmail?email=${email}`)
      .then((res) => {
        if (res.data.exists) {
          // Email already exists in the database

          setEmailVerified(false);
          setEmailError("Email already registered. You might have an account.");
        }
      })
      .catch((error) => {
        console.log("Error checking email. Please try again.", error.message);
      });
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            backgroundColor: COLORS.beige,
            height: "100%",
            width: "100%",
            // flex: 1,
            // justifyContent: "space-around",
            paddingTop: 40,
            paddingBottom: 10,
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.createAcountText}>Create an account</Text>
          </View>
          {/* form */}
          <View className="flex items-center mx-4 mt-10 space-y-4">
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-5 flex-row">
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
                style={[
                  styles.textInput,
                  focusedField === "username" && styles.focusedInput,
                ]}
                onChange={(e) => checkIfNameValid(e)}
                onEndEditing={() => checkIfNameExists()}
                onFocus={() => handleFocus("username")}
                onBlur={handleBlur}
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
              <View style={styles.errorContainer}>
                <Error
                  name="error"
                  size={20}
                  style={{ color: "red", marginRight: 5 }}
                />
                <Text style={styles.errorText}>{nameError} </Text>
              </View>
            )}
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-5 flex-row">
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
                onChange={(e) => checkIfEmailValid(e)}
                onEndEditing={() => checkIfEmailExists()}
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
              <View style={styles.errorContainer}>
                <Error
                  name="error"
                  size={20}
                  style={{ color: "red", marginRight: 5 }}
                />
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            )}

            <View className="bg-black/5 p-5 rounded-2xl w-full mb-5 flex-row">
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
                  <Feather
                    name="eye-off"
                    size={20}
                    style={{ color: "green" }}
                  />
                ) : (
                  <Feather name="eye" size={20} style={{ color: "green" }} />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", paddingHorizontal: 20 }}>
              {password.length < 1 ? null : passwordVerified ? null : (
                <View style={styles.errorContainer}>
                  <Error
                    name="error"
                    size={20}
                    style={{ color: "red", marginRight: 5 }}
                  />
                  <Text style={styles.errorText}>
                    Password must contain:
                    {"\n\u2022"} At least 1 uppercase letter
                    {"\n\u2022"} At least 1 lowercase letter
                    {"\n\u2022"} At least 1 number
                    {"\n\u2022"} Be at least 6 characters
                  </Text>
                </View>
              )}
            </View>
            <View className="w-full">
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSignup()}
              >
                <Text style={styles.buttonText}>Sign Up </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 20,
    backgroundColor: COLORS.blue,
    marginBottom: 12,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    textAlign: "center",
    color: "#f8f7f4",
  },
  createAcountText: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.blue,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE6E6",
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontFamily: "Poppins_500Medium_Italic",
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.blue,
  },
  modalButton: {
    backgroundColor: COLORS.pink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  imageContainer: {
    marginTop: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "90%",
    height: 100,
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 150,
  },
});

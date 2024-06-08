import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from 'axios';
import { useEmail } from "../EmailContext";

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const { setEmail: setEmailContext } = useEmail();

  

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        "http://192.168.151.43:33000/api/auth/login",
        {
          email: email,  
          password: password  
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log("connection successful..");
      console.log("jsonResponse..");
      console.log(response.data);
  
      if (response.status === 200) {
        console.log("Login successful..");
        setEmailContext(email);
        // After successful login, navigate to the next screen
        navigation.navigate("LoadingScreen");
      } else {
        console.log("Login failed..");
        Alert.alert(
          "Login failed",
          response.data.message || "Please check your credentials and try again."
        );
      }
    } catch (error) {
      console.log("this is catch block..");
      if (error.response) {
        const errorMessage = error.response.data.message || "Something went wrong.";
        Alert.alert("Login failed..", errorMessage);
      } else {
        // Server is unreachable or backend issue
        Alert.alert("Server Error", "Unable to connect to the server. Please try again later.");
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to HealthHive</Text>
      <Image source={require("../assets/sign-bg.png")} style={styles.sign_bg} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
        />
        <View style={styles.input}>
          <TextInput
            style={{ flex: 1, height: 48 }}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Reset")}>
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
  },
  sign_bg: {
    width: 350,
    height: 350,
    resizeMode: "cover",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#0000ff",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#0000ff",
    marginTop: 15,
  },
});

export default Signin;
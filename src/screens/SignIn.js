import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { useEmail } from "../EmailContext";
import { AuthContext } from "../../App";
import * as SQlite from "expo-sqlite";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { setEmail: setEmailContext } = useEmail();
  const { signIn } = React.useContext(AuthContext);



  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    console.log("Email:", text); // Debugging
    if (!validateEmail(text)) {
      setEmailError("Please enter a valid email address.");
      console.log("Email Error:", emailError); // Debugging
    } else {
      setEmailError("");
      console.log("Email Error cleared"); // Debugging
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    console.log("Password:", text); // Debugging
    if (text.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      console.log("Password Error:", passwordError); // Debugging
    } else {
      setPasswordError("");
      console.log("Password Error cleared"); // Debugging
    }
  };

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (password.length < 9) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    try {
      const body = new URLSearchParams({
        grant_type: "password",
        client_id: "Health-Hive-Client",
        username: email,
        password: password,
      });

      const response = await axios.post(
        "https://lemur-14.cloud-iam.com/auth/realms/teamnovauom/protocol/openid-connect/token",

        body.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        const db = await SQlite.openDatabaseAsync("HealthHive");
        const response = await db.getAllAsync(
          `SELECT * FROM folderData WHERE userEmail = ? AND folderName = ?`,
          [email, "Lab Reports"]
        );

        if (response.length === 0) {
          db.execAsync(
            `INSERT INTO folderData (folderName, userEmail) VALUES ('Lab Reports', '${email}');`
          );
        }
        db.closeAsync();
        setEmailContext(email);
        const token = data.access_token;

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        signIn(data.access_token, email);
      } else {
        Alert.alert(
          "Login failed",
          response.data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "Please check your credentials and try again.";
        Alert.alert("Login failed..", errorMessage);
      } else {
        Alert.alert(
          "Server Error",
          "Unable to connect to the server. Please try again later."
        );
      }
    }
  };

  const handleForgotPassword = () => {
    const url =
      "https://lemur-14.cloud-iam.com/auth/realms/teamnovauom/login-actions/reset-credentials";
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to HealthHive</Text>
      <Image source={require("../assets/sign-bg.png")} style={styles.sign_bg} />
      <View style={styles.inputContainer1}>
      <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          onChangeText={handleEmailChange}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
        />
        

        {emailError ? (
          <View style={styles.errorBox1}>
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}

        </View>
      <View style={styles.inputContainer2}>

        <View style={[styles.input, passwordError ? styles.inputError : null]}>
          <TextInput
            style={{ flex: 1, height: 48 }}
            onChangeText={handlePasswordChange}
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
        {passwordError ? (
            <View style={styles.errorBox2}>
              <Text style={styles.errorText}>{passwordError}</Text>
           </View>
          ) : null}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
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
    color: "#0056B3",
  },
  sign_bg: {
    width: 350,
    height: 350,
    resizeMode: "cover",
  },
  inputContainer1: {
    width: "100%",
    marginBottom: 0,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  inputContainer2: {
    width: "100%",
    marginBottom: 0,
    paddingVertical: 16,
    justifyContent: "space-between",
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
    backgroundColor: "#0056B3",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#0056B3",
    marginTop: 15,
  },
  inputError: {
    borderColor: "red",
  },
  errorBox1: {
    position: "absolute",
    top: 60,
    left: 8,
    right: 0,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 10,
  },
  errorBox2: {
    position: "absolute",
    top: 60,
    left: 8,
    right: 0,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default Signin;

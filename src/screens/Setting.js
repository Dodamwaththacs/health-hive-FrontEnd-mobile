import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Setting = () => {
  const navigation = useNavigation();

  const handleResetPassword = () => {
    Alert.alert(
      "Reset Password",
      "Are you sure you want to reset your password? This will open a browser window to reset your password.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            const url =
              "https://lemur-14.cloud-iam.com/auth/realms/teamnovauom/account/#/account-security/signing-in";
            Linking.openURL(url);
          },
        },
      ]
    );
  };
  const handleHelpAndSupport = () => {
    navigation.navigate("Help");
  };

  const handleAbout = () => {
    navigation.navigate("About");
  };

  const manageFiles = () => {
    navigation.navigate("ManageFiles");
  };

  const renderOption = (title, iconName, onPress) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.leftContent}>
        <Ionicons
          name={iconName}
          size={24}
          color="#003366"
          style={styles.icon}
        />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#003366" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderOption("Reset Your Password", "key-outline", handleResetPassword)}
      {renderOption("Manage Your Files", "document-outline", manageFiles)}
      {renderOption(
        "Help & Support",
        "help-circle-outline",
        handleHelpAndSupport
      )}
      {renderOption("About", "information-circle-outline", handleAbout)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#003366",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 10,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#003366",
  },
});

export default Setting;

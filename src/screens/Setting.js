import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const navigation = useNavigation();

  const handleResetPassword = () => {
    const url = "https://lemur-6.cloud-iam.com/auth/realms/teamnova/account/#/account-security/signing-in";
    Linking.openURL(url);
  };

  const handleHelpAndSupport = () => {
    navigation.navigate('Help');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const renderOption = (title, iconName, onPress) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.leftContent}>
        <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderOption("Reset Your Password", "key-outline", handleResetPassword)}
      {renderOption("Help & Support", "help-circle-outline", handleHelpAndSupport)}
      {renderOption("About", "information-circle-outline", handleAbout)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Setting;
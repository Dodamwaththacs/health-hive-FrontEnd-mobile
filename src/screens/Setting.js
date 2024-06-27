import React from "react";
import { View, Text, Button } from "react-native";
import { Linking } from "react-native";

const Setting = () => {
  const handleResetPassword = () => {
    const url =
      "https://lemur-6.cloud-iam.com/auth/realms/teamnova/account/#/account-security/signing-in";
    Linking.openURL(url);
  };

  return (
    <View>
      <Text>This is Setting!</Text>
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default Setting;
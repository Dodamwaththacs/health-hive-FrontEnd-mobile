import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { AuthContext } from "../../App";

const SignOut = () => {
  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    signOut();
  }, []);

  return (
    <View>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SignOut;

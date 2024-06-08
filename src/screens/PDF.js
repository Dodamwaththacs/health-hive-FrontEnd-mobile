import React from "react";
import { Button, Alert, StyleSheet, View } from "react-native";
import * as Linking from "expo-linking";
import axios from "axios";

const openPDF = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  } catch (error) {
    Alert.alert("An error occurred", error.message);
  }
};

const App = () => {
  const pdfUrl =
    "http://10.10.7.114:33000/file/QmXcWa9krGn3tegq1SrSh4eLfdNWP5PAkcPQe6wssTnyg6"; // Replace with your PDF file URL

  const getFile = async () => {
    console.log("Get File");
    try {
      const response = await axios.get(
        "http://10.10.7.114:33000/file/QmXcWa9krGn3tegq1SrSh4eLfdNWP5PAkcPQe6wssTnyg6"
      );
      console.log("this is responce \n\n", response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.centeredView}>
      <Button title="Open PDF" onPress={() => openPDF(pdfUrl)} />
      <Button title="Get File" onPress={getFile} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

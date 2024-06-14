import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you are using Expo for icons

const DocumentViewer = ({ route }) => {
  const { documentUri } = route.params;
  const navigation = useNavigation();
  console.log("Document URI:", documentUri);

  const handleClose = () => {
    navigation.goBack(); // Navigate back to the previous screen (Dashboard in this case)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close-circle" size={30} color="black" />
      </TouchableOpacity>
      <Image
        source={{ uri: "http://10.10.7.114:33000/file/" + documentUri }}
        style={styles.image}
        onError={(error) => console.error("Image loading error:", error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Optional: Add a background color for better visibility
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default DocumentViewer;

import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const DocumentViewer = ({ route }) => {
  const { documentUri } = route.params;
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);

  console.log("Document URI:", documentUri);

  const handleClose = async () => {
    try {
      await FileSystem.deleteAsync(imageUri);
      console.log("Image deleted successfully:", imageUri);
    } catch (error) {
      console.error("Error deleting the image:", error);
    } finally {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageUrl = "http://192.168.229.140:33000/api/ipfs/" + documentUri;
        const fileUri = `${FileSystem.cacheDirectory} ${documentUri}.jpg`;
        console.log("Image URL:", imageUrl);

        const response = await axios({
          url: imageUrl,
          method: "GET",
          responseType: "blob",
        });

        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = async () => {
          const base64data = reader.result;
          await FileSystem.writeAsStringAsync(
            fileUri,
            base64data.split(",")[1],
            { encoding: FileSystem.EncodingType.Base64 }
          );
          setImageUri(fileUri);
          console.log("Image written to file system:", fileUri);
        };
      } catch (error) {
        console.error("Error fetching the image: ", error);
      }
    };

    fetchImage();
  }, [documentUri]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close-circle" size={30} color="black" />
      </TouchableOpacity>
      <Image
        source={{
          uri: imageUri,
        }}
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

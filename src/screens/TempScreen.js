import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const App = () => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageUrl =
          "http://192.168.221.140:33000/api/ipfs/QmbMeNF5McP2UDH7GxkLrPr18PEquHX9N9fvwnhkD9coGH";
        const fileUri = `${FileSystem.documentDirectory}image.jpg`;

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
        };
      } catch (error) {
        console.error("Error fetching the image: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const databaseData = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(`SELECT * FROM fileStorage;`);
    console.log(response);
    db.closeAsync();
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Fetch data" onPress={databaseData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default App;

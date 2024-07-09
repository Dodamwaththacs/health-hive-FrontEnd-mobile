import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const FileScreen = ({ route }) => {
  const { folderName } = route.params;
  const [fileUri, setFileUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [Description, setDescription] = useState("");
  const [FileName, setFileName] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const navigation = useNavigation();

  const fetchData = async () => {
    const email = await SecureStore.getItemAsync("userEmail");
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(
      `SELECT * FROM fileStorage WHERE folderName = "${folderName}" AND userEmail = "${email}" ;`
    );
    const response1 = await db.getAllAsync(`SELECT * FROM fileStorage  ;`);
    console.log(response);
    console.log("Full DB data", response1);
    setData(response);
    db.closeAsync();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const filterByFileName = (text) => {
    const filtered = data.filter((item) =>
      item.fileName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    const fileUri = result.assets[0].uri;
    const fileType = result.assets[0].mimeType;
    console.log("File type:", fileType);
    if (fileType.startsWith("image/")) {
      setFileUri(fileUri);
      console.log("Image file selected:", fileUri);
      setModalVisible(true);
    }
    if (fileType.startsWith("application/pdf")) {
      console.log("PDF file selected:", fileUri);
      setFileUri(fileUri);
      setModalVisible(true);
    } else {
      // Handle non-image files here
      console.log("Non-image file selected:", fileType);
    }
    console.log(result);
  };

  const openDocument = (hash) => {
    navigation.navigate("DocumentViewer", { documentUri: hash });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => openDocument(item.hash)}>
          <Icon name="document-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const fileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: "file",
        type: "image/jpeg", // Adjust the file type as needed
      });
      const currentDate = new Date();
      const response = await axios.post(
        "http://192.168.3.43:33000/api/ipfs/upload",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const hash = response.data;
      console.log("File uploaded successfully:", hash);
      const email = await SecureStore.getItemAsync("userEmail");
      const isoDate = currentDate.toISOString();
      const db = await SQLite.openDatabaseAsync("HealthHive");
      await db.execAsync(
        `INSERT INTO fileStorage (userEmail,fileName, folderName, description, hash, date) VALUES ('${email}','${FileName}', '${folderName}', '${Description}', '${hash}', '${isoDate}');`
      );
      db.closeAsync();
      setModalVisible(false);
      Alert.alert("File uploaded successfully!");
      setFileUri(null);
      setFileName("");
      setDescription("");

      // Fetch the updated data
      fetchData();
    } catch (error) {
      console.error("Error uploading file:", error);
      setModalVisible(false);
      Alert.alert("File uploaded Error!");
      setFileUri(null);
      setFileName("");
      setDescription("");
    }
  };

  const dropDatabase = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    await db.execAsync(`DROP TABLE fileStorage;`);
    db.closeAsync();
    console.log("Database dropped successfully!");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.head}>{folderName}</Text>

        {!fileUri && <Button onPress={pickFile} title="Pick a file" />}

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />

        <Modal animationType="slide" visible={modalVisible}>
          {fileUri && (
            <View style={styles.container_2}>
              <Image
                source={{ uri: fileUri }}
                style={{ width: "50%", height: "50%" }}
              />
              <TextInput
                style={styles.Inputs}
                onChangeText={setFileName}
                value={FileName}
                placeholder="File Name"
              />
              <TextInput
                style={styles.Inputs}
                onChangeText={setDescription}
                value={Description}
                placeholder="Description"
              />

              <TouchableOpacity style={styles.button} onPress={fileUpload}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          )}
        </Modal>

        {/* <Button onPress={databaseHandling} title="Create DB" /> */}
        {/* <Button onPress={databaseData} title="Data DB" /> */}
        <Button onPress={dropDatabase} title="Drop DB" />
        {/* <Button onPress={tempDataEntry} title="Insert Data" /> */}
        {/* <Button onPress={testConnection} title="Test Connection" /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 80,
  },
  head: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  container_2: {
    alignItems: "center",
    justifyContent: "center",
  },
  Inputs: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 20,
    width: "100%",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0000ff",
    padding: 10,
    borderRadius: 20,
    width: "50%",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
  fileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
  },
  folderName: {
    fontSize: 14,
  },
  hash: {
    fontSize: 12,
  },
});

export default FileScreen;

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

const FileScreen = ({ route }) => {
  const [fileUri, setFileUri] = useState(null);
  const [fileDownloadUri, setFileDownloadUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filemodalVisible, setFileModalVisible] = useState(false);
  const { folderName } = route.params;
  const [Description, setDescription] = useState("");
  const [FileName, setFileName] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);

  const fetchData = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(
      `SELECT * FROM fileStorage WHERE folderName = "${folderName}" ;`
    );
    console.log(response);
    setData(response);
    db.closeAsync();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterByFileName = (text) => {
    const filtered = data.filter((item) =>
      item.fileName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const fileOpen = (hash) => {
    setFileDownloadUri("http://10.10.18.247:33000/file/" + hash);
    setFileModalVisible(true);
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
    } else {
      // Handle non-image files here
      console.log("Non-image file selected:", fileType);
    }
    console.log(result);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => fileOpen(item.hash)}>
          <Icon name="document-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const databaseData = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const firstRow = await db.getAllAsync(
      `SELECT * FROM fileStorage WHERE folderName = "${folderName}" ;`
    );
    console.log(firstRow);
    db.closeAsync();
  };

  const fileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: "file",
        type: "image/jpeg", // Adjust the file type as needed
      });
      console.log("File log: ", fileUri);
      const currentDate = new Date();
      console.log("Current Date and Time: ", currentDate);
      const response = await axios.post(
        "http://10.10.18.247:33000/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const hash = response.data;
      console.log("File uploaded successfully:", response.data);

      const isoDate = currentDate.toISOString();
      console.log("ISO Date and Time: ", isoDate);

      const db = await SQLite.openDatabaseAsync("HealthHive");
      await db.execAsync(
        `INSERT INTO fileStorage (fileName, folderName, description, hash, date) VALUES ('${FileName}', '${folderName}', '${Description}', '${hash}', '${isoDate}');`
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
    }
  };

  const testConnection = async () => {
    try {
      const response = await axios.get("http://10.10.18.247:33000/");
      Alert.alert("Connection Successful!");
      console.log(response.data);
    } catch (error) {
      Alert.alert("Connection Failed!");
      console.error(error);
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
        <Modal animationType="slide" visible={filemodalVisible}>
          <Image
            source={{ uri: fileDownloadUri }}
            style={{ width: "50%", height: "50%" }}
          />
          <Button onPress={() => setFileModalVisible(false)} title="Done" />
        </Modal>

        {/* <Button onPress={databaseHandling} title="Create DB" /> */}
        {/* <Button onPress={databaseData} title="Data DB" /> */}
        {/* <Button onPress={dropDatabase} title="Drop DB" /> */}
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

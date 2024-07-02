import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import ItemComponent from "./ItemComponents";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

const LabFolder = ({ route }) => {
  const { folderName } = route.params;
  const [data, setData] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [filemodalVisible, setFileModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [fileDownloadUri, setFileDownloadUri] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileUri, setFileUri] = useState(null);
  const [FileName, setFileName] = useState("");
  const [Description, setDescription] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchDataFromLocal = async () => {
        const email = await SecureStore.getItemAsync("userEmail");
        const db = await SQLite.openDatabaseAsync("HealthHive");
        const response = await db.getAllAsync(
          `SELECT * FROM fileStorage WHERE folderName = "${folderName}" AND userEmail = "${email}" ;`
        );
        setData(response);
        await db.closeAsync();
      };

      fetchDataFromLocal();

      // This return function is optional and will be called when the screen loses focus
      return () => {
        // Clean up any subscriptions or timers if needed
      };
    }, [folderName, folderModalVisible]) // Add any other dependencies here
  );

  const handleMove = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(
      `SELECT folderName
      FROM folderData
      WHERE folderName NOT IN ('LabReports', '${folderName}')
      ORDER BY folderName ASC;`
    );
    await db.closeAsync();
    setFolderData(response);
    console.log("folder data :", response);
    setFolderModalVisible(true);

    console.log("inseted data responce :", response);
    setShowCheckboxes(false);
  };

  const alterTable = async (moveFolderName) => {
    console.log("moveFolderName :", moveFolderName);
    const db = await SQLite.openDatabaseAsync("HealthHive");
    console.log("selectedItems :", selectedItems);
    console.log("moveFolderName :", moveFolderName);
    try {
      for (let i = 0; i < selectedItems.length; i++) {
        await db.runAsync(
          `UPDATE fileStorage SET folderName = "${moveFolderName}" WHERE id = ${selectedItems[i]} ;`
        );
      }
      alert("Files moved successfully!");
    } catch (error) {
      console.error("Error data update : ", error);
    } finally {
      await db.closeAsync();
      setSelectedItems([]);
      setFolderModalVisible(false);
    }
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
        "http://192.168.115.140:33000/api/ipfs/upload",

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
    } catch (error) {
      console.error("Error uploading file:", error);
      setModalVisible(false);
      Alert.alert("File uploaded Error!");
      setFileUri(null);
      setFileName("");
      setDescription("");
    }
  };

  const handleClose = async () => {
    setModalVisible(false);
    setFileName("");
    setDescription("");
    setFileUri(null);
  };

  const dropDatabase = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    await db.execAsync(`DROP TABLE fileStorage;`);
    db.closeAsync();
    console.log("Database dropped successfully!");
  };

  const databaseData = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(`SELECT * FROM fileStorage;`);
    console.log("Database data:", response);
    db.closeAsync();
  };

  const renderItem = ({ item }) => (
    <ItemComponent
      item={item}
      filemodalVisible={filemodalVisible}
      setFileModalVisible={setFileModalVisible}
      fileDownloadUri={fileDownloadUri}
      setFileDownloadUri={setFileDownloadUri}
      showCheckboxes={showCheckboxes}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  );

  const renderFolderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => alterTable(item.folderName)}
      >
        <Text style={styles.title}>{item.folderName}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.head}>{folderName}</Text>

      {!fileUri && <Button onPress={pickFile} title="Pick a file" />}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title=" Database Data" onPress={databaseData} />
      {!showCheckboxes && data.length > 0 && (
        <Button
          title="Move file"
          onPress={() => setShowCheckboxes(!showCheckboxes)}
        />
      )}
      {selectedItems.length > 0 && showCheckboxes && (
        <Button title="done" onPress={handleMove} />
      )}

      <Modal animationType="slide" visible={folderModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.moveFolderHeader}>
              <Text>Select folder you want to move</Text>
              <TouchableOpacity>
                <Icon
                  name="close"
                  size={30}
                  color={"blue"}
                  onPress={() =>
                    setFolderModalVisible(false) && setSelectedItems(null)
                  }
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={folderData}
              renderItem={renderFolderItem}
              keyExtractor={(item) => item.folderName}
            />
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" visible={modalVisible}>
        {fileUri && (
          <View style={styles.container_2}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close-circle" size={30} color="black" />
            </TouchableOpacity>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  head: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  head2: {
    fontSize: 18,
    marginBottom: 10,
  },

  moveFolderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // other styles...
  },
  item: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 4, // Add some elevation for a subtle shadow effect
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "30%", // Adjust the height as per your requirement
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

  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default LabFolder;

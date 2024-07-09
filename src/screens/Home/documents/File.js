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
  Platform,
  StatusBar,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import ItemComponent from "./ItemComponents";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

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
  const [dropDown, setDropDown] = useState(false);

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

      return () => {};
    }, [folderName, folderModalVisible, modalVisible])
  );

  const handleMove = async () => {
    const email = await SecureStore.getItemAsync("userEmail");
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(
      `SELECT folderName
      FROM folderData
      WHERE folderName NOT IN ('Lab Reports', '${folderName}') AND userEmail = '${email}'
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
    if (result.canceled === true) {
      return;
    }
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
        "http://13.202.67.81:10000/usermgtapi/api/ipfs/upload",

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

  const handlePress = () => {
    setDropDown(!dropDown);
    console.log("dropDown :", dropDown);
  };

  const dropDatabase = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    await db.execAsync(`DROP TABLE fileStorage;`);
    db.closeAsync();
    console.log("Database dropped successfully!");
  };

  const databaseData = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(`SELECT * FROM folderData;`);
    console.log(response);
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
      setDropDown={setDropDown}
      dropDown={dropDown}
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
    <View style={styles.view}>
      <View style={styles.headContainer}>
        <Text style={styles.head}>{folderName}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handlePress()}
        >
          <Ionicons
            name="ellipsis-horizontal-sharp"
            size={40}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        {!fileUri && <Button onPress={pickFile} title="Pick a file" />}

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
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
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
        {/* <Button title="DB drop" onPress={DatabaseData} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0056B3",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 16,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },

  head: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  head2: {
    fontSize: 18,
    color: "#34495e",
    marginBottom: 12,
  },
  moveFolderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  item: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    height: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  container_2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 24,
  },
  Inputs: {
    height: 48,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 24,
    paddingLeft: 20,
    width: "100%",
    fontSize: 16,
    color: "#34495e",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 14,
    borderRadius: 24,
    width: "60%",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  closeButton: {
    position: "absolute",
    top: 24,
    right: 24,
    zIndex: 1,
  },
});

export default LabFolder;

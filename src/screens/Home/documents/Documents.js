import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";

import AddButton from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";

const baseDir = `${FileSystem.documentDirectory}HealthHive/`;

const FolderCreator = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [directories, setDirectories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [currentFolderToRename, setCurrentFolderToRename] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const navigation = useNavigation();

  const labFolder = baseDir + "LabReports/";

  const refreshEffect = () => {
    setRefreshKey((oldKey) => oldKey + 1);
    console.log("Refreshed");
  };

  const createDirectory = async (folderName) => {
    const dirUri = `${baseDir}${folderName}`;
    console.log(dirUri);
    try {
      const info = await FileSystem.getInfoAsync(dirUri);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
        const db = await SQLite.openDatabaseAsync("HealthHive");
        await db.execAsync(
          `INSERT INTO folderData (folderName) VALUES ('${folderName}');`
        );
        db.closeAsync();

        return true;
      } else {
        console.log("Directory already exists!");
        return false;
      }
    } catch (error) {
      console.error("Error creating directory:", error);
      return false;
    }
  };

  const handlePress = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const createBaseDirectory = async () => {
    try {
      const info = await FileSystem.getInfoAsync(baseDir);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
        createDirectory("LabReports");
        const db = await SQLite.openDatabaseAsync("HealthHive");
        await db.execAsync(
          `INSERT INTO folderData (folderName) VALUES ('LabReports');`
        );
        db.closeAsync();
      }
    } catch (error) {
      console.error("Error creating base directory:", error);
    }
  };

  const handleCreateFolder = async () => {
    setDropdownOpen(false);
    if (await createDirectory(folderName)) {
      updateDirectoryList();
    }
    setFolderName("");
    setModalVisible(false);
  };

  const handleNavigation = (name) => {
    if (name == "LabReports") {
      navigation.navigate("LabFolder", { folderName: name });
    } else {
      navigation.navigate("File", { folderName: name });
    }
  };

  const listDirectories = async () => {
    try {
      const result = await FileSystem.readDirectoryAsync(baseDir);
      return result;
    } catch (error) {
      console.error("Failed to read directory:", error);
      return [];
    }
  };

  const deleteDirectory = async (folderName) => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(
      `SELECT * FROM fileStorage WHERE folderName = '${folderName}';`
    );
    console.log("Files in folder: ", response);
    if (response.length > 0) {
      alert(`Folder is not empty! You can not delete ${folderName}.`);
      return;
    }

    const confirmDelete = await new Promise((resolve) => {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete the folder "${folderName}"?`,
        [
          { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
          { text: "Yes", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });

    if (!confirmDelete) {
      return;
    }

    const dirUri = `${baseDir}${folderName}`;
    try {
      const info = await FileSystem.getInfoAsync(dirUri);
      if (info.exists) {
        await FileSystem.deleteAsync(dirUri, { idempotent: true });
        const db = await SQLite.openDatabaseAsync("HealthHive");
        await db.execAsync(
          `DELETE FROM folderData WHERE folderName = '${folderName}';`
        );
      } else {
        console.log("Directory does not exist!");
      }
    } catch (error) {
      console.error("Error deleting directory:", error);
    } finally {
      setDropdownOpen(false);
      updateDirectoryList();
      db.closeAsync();
    }
  };

  const getfiledata = async () => {
    const oldDirUri = `${baseDir}`;
    const info = await FileSystem.getInfoAsync(oldDirUri);
    console.log(info);
  };

  const renameDirectory = async (oldFolderName, newFolderName) => {
    const oldDirUri = `${baseDir}${oldFolderName}`;
    const newDirUri = `${baseDir}${newFolderName}`;

    try {
      const info = await FileSystem.getInfoAsync(oldDirUri);
      if (info.exists) {
        await FileSystem.moveAsync({
          from: oldDirUri,
          to: newDirUri,
        });
        console.log(
          `Directory renamed from ${oldFolderName} to ${newFolderName}`
        );

        const db = await SQLite.openDatabaseAsync("HealthHive");
        await db.execAsync(
          `UPDATE folderData SET folderName = '${newFolderName}' WHERE folderName = '${oldFolderName}';`
        );
        await db.execAsync(`UPDATE fileStorage
        SET folderName = '${newFolderName}'
        WHERE folderName = '${oldFolderName}';`);

        const response = await db.getAllAsync(`SELECT * FROM fileStorage;`);
        const response2 = await db.getAllAsync(`SELECT * FROM folderData;`);
        console.log("File storage data : ", response);
        console.log("Folder data : ", response2);

        updateDirectoryList();
        setRenameModalVisible(false);
      } else {
        console.log("Directory does not exist!");
      }
    } catch (error) {
      console.error("Error renaming directory:", error);
    } finally {
      setDropdownOpen(false);
      refreshEffect();
    }
  };

  const handleRenamePress = (folderName) => {
    setCurrentFolderToRename(folderName);
    setNewFolderName(folderName);
    setRenameModalVisible(true);
  };

  const updateDirectoryList = async () => {
    const dirs = await listDirectories();
    console.log("Directories:", dirs);

    const sortedDirs = dirs.sort((a, b) => {
      if (a === "LabReports") return -1;
      if (b === "LabReports") return 1;
      return a.localeCompare(b);
    });

    setDirectories(sortedDirs);
  };

  useEffect(() => {
    createBaseDirectory();
    updateDirectoryList();
  }, [refreshKey]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.editButton}>
        <Icon name="ellipsis-v" size={40} color="#000" />
      </TouchableOpacity>

      <ScrollView style={styles.directoryList}>
        {directories.map((dir, index) => (
          <View key={index} style={styles.directoryItem}>
            <TouchableOpacity onPress={() => handleNavigation(dir)}>
              <Icon name="folder" size={40} color="#000" />
            </TouchableOpacity>
            <Text style={styles.folderText}>{dir}</Text>

            {dropdownOpen && dir !== "LabReports" && (
              <View style={styles.popButtons}>
                <TouchableOpacity onPress={() => deleteDirectory(dir)}>
                  <FontAwesome5
                    style={styles.popButtonIcon}
                    name="trash"
                    size={20}
                    color="red"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRenamePress(dir)}>
                  <FontAwesome5 name="edit" size={20} color="blue" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.plusButton}
      >
        <AddButton name="pluscircleo" color={"blue"} size={60} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={30} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Enter folder name"
              value={folderName}
              onChangeText={setFolderName}
            />
            <Button title="Create Folder" onPress={handleCreateFolder} />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter new folder name"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setRenameModalVisible(false)}
              />
              <Button
                title="Rename"
                onPress={() =>
                  renameDirectory(currentFolderToRename, newFolderName)
                }
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* <Button title="Get File Data" onPress={getfiledata} />
      <Button title="List Directories" onPress={listDirectories} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    padding: 20,
    marginTop: 40, // need to remove
    marginRight: 20, // need to remove
  },
  editButton: {
    alignSelf: "flex-end",
    position: "absolute",
  },
  popButtons: {
    flexDirection: "row",
  },
  popButtonIcon: {
    marginRight: 8,
  },
  directoryList: {
    width: "100%",
    maxHeight: "90%",
    flex: 1,
  },
  plusButton: {
    position: "absolute",
    bottom: 0,
    right: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
  directoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%", // Ensure full width is used
  },
  folderText: {
    flex: 1, // Take up all available space
    marginLeft: 20, // Space between the icon and the text
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10, // Add padding for easier pressing
  },
});

export default FolderCreator;

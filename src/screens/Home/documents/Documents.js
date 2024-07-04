import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  FlatList,
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
import * as SecureStore from "expo-secure-store";

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
  const [userEmail, setUserEmail] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getEmail();
    updateDirectoryList();
  }, [refreshKey]);

  const getEmail = async () => {
    const email = await SecureStore.getItemAsync("userEmail");
    setUserEmail(email);
  };

  const refreshEffect = () => {
    setRefreshKey((oldKey) => oldKey + 1);
    console.log("Refreshed");
  };

  const createDirectory = async (folderName) => {
    console.log(userEmail, "asxasda");
    const db = await SQLite.openDatabaseAsync("HealthHive");
    try {
      const response = await db.getAllAsync(
        "SELECT * FROM folderData WHERE folderName = ? AND userEmail = ?;",
        [folderName, userEmail]
      );
      if (response.length > 0) {
        alert("Folder already exists!");
        return false;
      }
      await db.execAsync(
        `INSERT INTO folderData (folderName, userEmail, createdAt) VALUES ("${folderName}", "${userEmail}", CURRENT_TIMESTAMP);`
      );
      console.log("Folder created");
    } catch (error) {
      console.error("Error creating directory:", error);
      return false;
    } finally {
      db.closeAsync();
    }

    return true;
  };

  const handlePress = () => {
    setDropdownOpen(!dropdownOpen);
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
    if (name == "Lab Reports") {
      navigation.navigate("LabFolder", { folderName: name });
    } else {
      navigation.navigate("File", { folderName: name });
    }
  };

  const listDirectories = async () => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      const db = await SQLite.openDatabaseAsync("HealthHive");
      const response = await db.getAllAsync(
        `SELECT * FROM folderData WHERE userEmail ='${email}' ;`
      );
      const folderNames = response.map((item) => item.folderName);
      db.closeAsync();
      return folderNames;
    } catch (error) {
      console.error("Failed to read directory:", error);
      return [];
    }
  };

  const deleteDirectory = async (folderName) => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(
      `SELECT * FROM fileStorage WHERE folderName = '${folderName}' AND userEmail = "${userEmail}";`
    );
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

    try {
      console.log("Deleting directory:", folderName);
      await db.execAsync(
        `DELETE FROM folderData WHERE folderName = '${folderName}' AND userEmail = "${userEmail}";`
      );
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
    const sortedDirs = dirs.sort((a, b) => {
      if (a === "Lab Reports") return -1;
      if (b === "Lab Reports") return 1;
      return a.localeCompare(b);
    });

    setDirectories(sortedDirs);
  };

  const dropDB = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    await db.execAsync(`DROP TABLE folderData;`);
    await db.execAsync(`DROP TABLE fileStorage;`);
    db.closeAsync();
    console.log("Database dropped");
  };

  const tempDataEntry = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    await db.execAsync(`
                      INSERT INTO folderData (folderName, userEmail, createdAt) VALUES
                      ('Lab Reports', 'adam@gmail.com', CURRENT_TIMESTAMP);
                      
    `);
    db.closeAsync();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.editButton}>
        <Icon name="ellipsis-v" size={40} color="#000" />
      </TouchableOpacity>

      <FlatList
        data={directories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: dir, index }) => (
          <View style={styles.directoryItem}>
            <TouchableOpacity onPress={() => handleNavigation(dir)}>
              <Icon name="folder" size={40} color="#000" />
            </TouchableOpacity>
            <Text style={styles.folderText}>{dir}</Text>

            {dropdownOpen && dir !== "Lab Reports" && (
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
        )}
        style={styles.directoryList}
      />

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
      {/* <Button title="Temp data DB" onPress={tempDataEntry} /> */}
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

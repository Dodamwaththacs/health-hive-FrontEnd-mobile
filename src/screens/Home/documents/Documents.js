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
} from "react-native";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome";
import AddButton from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const baseDir = `${FileSystem.documentDirectory}HealthHive/`;

const FolderCreator = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [directories, setDirectories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const labFolder = baseDir + "LabReports/";

  useEffect(() => {
    createBaseDirectory();
    updateDirectoryList();
  }, []);

  const handlePress = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const createBaseDirectory = async () => {
    try {
      const info = await FileSystem.getInfoAsync(baseDir);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
        createDirectory("LabReports");
      }
    } catch (error) {
      console.error("Error creating base directory:", error);
    }
  };

  const handleCreateFolder = async () => {
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
      navigation.navigate("file", { folderName: name });
    }
  };

  const createDirectory = async (folderName) => {
    const dirUri = `${baseDir}${folderName}`;
    console.log(dirUri);
    try {
      const info = await FileSystem.getInfoAsync(dirUri);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
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
    const dirUri = `${baseDir}${folderName}`;
    try {
      const info = await FileSystem.getInfoAsync(dirUri);
      if (info.exists) {
        await FileSystem.deleteAsync(dirUri, { idempotent: true });
      } else {
        console.log("Directory does not exist!");
      }
    } catch (error) {
      console.error("Error deleting directory:", error);
    }
    setDropdownOpen(false);
    updateDirectoryList();
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
      } else {
        console.log("Directory does not exist!");
      }
    } catch (error) {
      console.error("Error renaming directory:", error);
    }
  };

  const updateDirectoryList = async () => {
    const dirs = await listDirectories();
    setDirectories(dirs);
  };

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

            {dropdownOpen && (
              <View style={styles.popButtons}>
                <TouchableOpacity onPress={() => deleteDirectory(dir)}>
                  <FontAwesome5
                    style={styles.popButtonIcon}
                    name="trash"
                    size={20}
                    color="red"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => renameDirectory(dir, "newName")}
                >
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
});

export default FolderCreator;

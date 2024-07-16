import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  TextInput,
} from "react-native";
import * as SQLite from "expo-sqlite";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const SelectFiles = ({ route }) => {
  const navigation = useNavigation();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, scannedUserId, labReportSharesId } = route.params;

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("HealthHive");
      const response = await db.getAllAsync(
        `SELECT DISTINCT folderName FROM fileStorage WHERE userEmail = "${user.email}"`
      );
      await db.closeAsync();
      setFolders(response.map((item) => item.folderName));
    } catch (error) {
      console.error("Error fetching folders:", error.message);
    }
  };

  const handleFolderPress = async (folderName) => {
    try {
      const db = await SQLite.openDatabaseAsync("HealthHive");
      const response = await db.getAllAsync(
        `SELECT * FROM fileStorage WHERE userEmail = "${user.email}" AND folderName = "${folderName}"`
      );
      await db.closeAsync();
      setFiles(response);
      setCurrentFolder(folderName);
      setSearchQuery("");
    } catch (error) {
      console.error("Error fetching files:", error.message);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFiles((prevSelected) => {
      if (prevSelected.some((f) => f.id === file.id)) {
        return prevSelected.filter((f) => f.id !== file.id);
      } else {
        return [...prevSelected, file];
      }
    });
  };

  const handleShareFiles = async () => {
    try {
      for (let file of selectedFiles) {
        console.log(
          `lab report id = ${labReportSharesId} file hash = ${file.hash} scanneduser = ${scannedUserId} name = ${user.fullName}`
        );
        await axios.post(
          "http://13.202.67.81:10000/usermgtapi/api/shareFiles",
          {
            labReportShare: labReportSharesId,
            fileHash: file.hash,
            doctorId: scannedUserId,
            patientName: user.fullName,
          }
        );
      }
      Alert.alert("Success", "Health reports shared successfully.");
      navigation.navigate("Scan");
    } catch (error) {
      Alert.alert("Error", "Failed to share health records.");
      console.error("Error sharing health reports:", error.message);
    }
  };

  const renderItem = ({ item }) => {
    if (currentFolder === null) {
      // Render folder
      return (
        <TouchableOpacity
          style={styles.folderContainer}
          onPress={() => handleFolderPress(item)}
        >
          <Icon name="folder" size={40} color="#003366" />
          <Text style={styles.folderName}>{item}</Text>
        </TouchableOpacity>
      );
    } else {
      // Render file
      const isSelected = selectedFiles.some((f) => f.id === item.id);
      return (
        <TouchableOpacity
          style={[
            styles.fileContainer,
            isSelected && styles.selectedFileContainer,
          ]}
          onPress={() => handleFileSelect(item)}
        >
          <Icon name="file" size={30} color="#003366" />
          <Text style={styles.fileName}>{item.fileName}</Text>
        </TouchableOpacity>
      );
    }
  };

  const filteredData = currentFolder
    ? files.filter((file) =>
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : folders.filter((folder) =>
        folder.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {currentFolder ? `Files in ${currentFolder}` : "Select Folder"}
      </Text>
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color="#003366"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={currentFolder ? "Search files..." : "Search folders..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => (item.id ? item.id.toString() : item)}
        renderItem={renderItem}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            if (currentFolder) {
              setCurrentFolder(null);
              setSearchQuery("");
            } else {
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {currentFolder ? "Back to Folders" : "Cancel"}
          </Text>
        </TouchableOpacity>
        {currentFolder && (
          <TouchableOpacity
            style={[
              styles.button2,
              selectedFiles.length === 0 && styles.disabledButton,
            ]}
            onPress={handleShareFiles}
            disabled={selectedFiles.length === 0}
          >
            <Text style={styles.buttonText}>
              Share Selected Files ({selectedFiles.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#003366",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  folderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "98%",
    height: 70,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  folderName: {
    marginLeft: 15,
    fontSize: 18,
    color: "#333",
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    width: "98%",
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedFileContainer: {
    backgroundColor: "#e6f2ff",
    borderColor: "#003366",
    borderWidth: 1,
  },
  fileName: {
    marginLeft: 15,
    fontSize: 16,
    color: "#003366",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button1: {
    backgroundColor: "#FF4136",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
  },
  button2: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
});

export default SelectFiles;

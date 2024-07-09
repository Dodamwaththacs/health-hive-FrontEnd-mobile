import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

function ManageFiles() {
  const handleExport = async () => {
    const confirmExport = await new Promise((resolve) => {
      Alert.alert(
        "Confirm Export",
        "Are you sure you want to export your files?",
        [
          { text: "No", onPress: () => resolve(false), style: "cancel" },
          { text: "Yes", onPress: () => resolve(true) },
        ]
      );
    });

    if (confirmExport) {
      const email = await SecureStore.getItemAsync("userEmail");
      const db = await SQLite.openDatabaseAsync("HealthHive");
      const folderDataResponse = await db.getAllAsync(
        `SELECT * FROM folderData WHERE folderName NOT IN ('Lab Reports') AND userEmail = "${email}";`
      );
      const fileStorageResponse = await db.getAllAsync(
        `SELECT * FROM fileStorage WHERE userEmail = "${email}";`
      );
      const combinedData = {
        folderData: folderDataResponse,
        fileStorage: fileStorageResponse,
      };
      const combinedJson = JSON.stringify(combinedData, null, 2);

      const combinedDataPath = `${FileSystem.documentDirectory}healthHiveUserFile.json`;
      await FileSystem.writeAsStringAsync(combinedDataPath, combinedJson);
      db.closeAsync();
      const apiPayload = {
        to: `${email}`,
        subject: "Helath Hive Data Backup",
        text: "This is the backup of your data. Please keep this file safe. Do not share this file with anyone!.\n This file is encrypted and can only be decrypted by Health Hive. Use Import option in Manage Files to import this file.",
        jsonContent: combinedJson,
      };

      try {
        const responce = await axios.post(
          "http://13.202.67.81:10000/usermgtapi/api/email/send",
          apiPayload
        );
        console.log("responce", responce);
      } catch (e) {
        console.log(e);
      }
      alert("Data exported successfully!");
    }
  };

  const handleImport = async () => {
    const confirmImport = await new Promise((resolve) => {
      Alert.alert(
        "Confirm Import",
        "Are you sure you want to import files? This may overwrite existing data.",
        [
          { text: "No", onPress: () => resolve(false), style: "cancel" },
          { text: "Yes", onPress: () => resolve(true) },
        ]
      );
    });

    if (confirmImport) {
      const db = await SQLite.openDatabaseAsync("HealthHive");

      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/json",
        });
        if (result.assets[0].name === "healthhive_backup.json") {
          const fileContents = await FileSystem.readAsStringAsync(
            result.assets[0].uri
          );
          const importedData = JSON.parse(fileContents);

          try {
            const folderData = importedData.folderData;

            for (let i = 0; i < folderData.length; i++) {
              const folder = folderData[i];

              const responce = await db.getAllAsync(
                `SELECT * FROM folderData WHERE folderName="${folder.folderName}" AND userEmail = "${folder.userEmail}";`
              );
              console.log("import responce", responce);
              if (responce.length > 0) {
                console.log(
                  "This Folder already Exsists : ",
                  folder.folderName
                );
                continue;
              }
              console.log("after folderData if");
              await db.execAsync(
                `INSERT INTO folderData (folderName, userEmail, createdAt) VALUES ("${folder.folderName}", "${folder.userEmail}", "${folder.createdAt}");`
              );
            }
          } catch (e) {
            console.log(e);
          }
          try {
            const fileStorage = importedData.fileStorage;

            for (let i = 0; i < fileStorage.length; i++) {
              const folder = fileStorage[i];

              const responce = await db.getAllAsync(
                `SELECT * FROM fileStorage WHERE userEmail = "${folder.userEmail}" AND fileName = "${folder.fileName}";`
              );
              if (responce.length > 0) {
                console.log("This File already Exsists : ", folder.fileName);
                continue;
              }
              console.log("after fileStorage if");
              await db.execAsync(
                `INSERT INTO fileStorage (userEmail, fileName, folderName, description, hash, date) VALUES ("${folder.userEmail}", "${folder.fileName}", "${folder.folderName}", "${folder.description}", "${folder.hash}", "${folder.date}");`
              );
            }
          } catch (e) {
            console.log(e);
          }
          alert("Data imported successfully!");
        }
      } catch (error) {
        alert("An error occurred while importing the file");
      } finally {
        db.closeAsync();
      }
    }
  };

  const dropTables = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    try {
      await db.execAsync(`DROP TABLE IF EXISTS folderData;`);
      await db.execAsync(`DROP TABLE IF EXISTS fileStorage;`);
      alert("Tables dropped successfully!");
    } catch (e) {
      console.log(e);
    } finally {
      db.closeAsync();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={handleExport}>
        <Ionicons name="document-outline" size={24} color="#14213d" />
        <Text style={styles.optionText}>Export Your Files</Text>
        <Ionicons name="chevron-forward" size={24} color="#14213d" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleImport}>
        <Ionicons name="folder-outline" size={24} color="#14213d" />
        <Text style={styles.optionText}>Import Files</Text>
        <Ionicons name="chevron-forward" size={24} color="#14213d" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#14213d",
  },
});

export default ManageFiles;

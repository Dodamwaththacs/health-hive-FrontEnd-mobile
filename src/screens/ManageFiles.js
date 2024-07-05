import React from "react";
import { View, Text, Button } from "react-native";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

function ManageFiles() {
  const handleExport = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const folderDataResponse = await db.getAllAsync(
      `SELECT * FROM folderData WHERE folderName NOT IN ('Lab Reports');`
    );
    const fileStorageResponse = await db.getAllAsync(
      `SELECT * FROM fileStorage;`
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
      to: "chamikasandun3131@gmail.com",
      subject: "Helath Hive Data Backup",
      text: "This is the backup of your data. Please keep this file safe. Do not share this file with anyone!.\n This file is encrypted and can only be decrypted by Health Hive. Use Import option in Manage Files to import this file.",
      jsonContent: combinedJson,
    };

    try {
      const responce = await axios.post(
        "http://192.168.196.140:33000/api/email/send",
        apiPayload
      );
      console.log("responce", responce);
    } catch (e) {
      console.log(e);
    }
    alert("Data exported successfully!");
  };

  const handleImport = async () => {
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
              console.log("This Folder already Exsists : ", folder.folderName);
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
      console.error("Error importing file:", error);
      alert("An error occurred while importing the file");
    } finally {
      db.closeAsync();
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
    <View>
      <Text>ManageFiles</Text>
      <Button title="Export" onPress={handleExport} />
      <Button title="Import" onPress={handleImport} />
      <Button title="Drop Tables" onPress={dropTables} />
    </View>
  );
}

export default ManageFiles;

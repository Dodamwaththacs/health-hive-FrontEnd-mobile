import React from "react";
import { View, Text, Button } from "react-native";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

function ManageFiles() {
  const databaseData = async () => {
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
    console.log("json full", combinedData);
    const jsonString = JSON.stringify(combinedData);
    const escapedJsonString = jsonString
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
    console.log("json escaped", escapedJsonString);

    const combinedDataPath = `${FileSystem.documentDirectory}healthHiveUserFile.json`;
    await FileSystem.writeAsStringAsync(combinedDataPath, combinedJson);
    db.closeAsync();
    // await shareFile(combinedDataPath);
    const apiPayload = {
      to: "chamikasandun3131@gmail.com",
      subject: "string",
      text: "string",
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
    alert("Data has been saved to local storage.");
  };

  const shareFile = async (filePath) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing is not available on this device");
      return;
    }

    try {
      await Sharing.shareAsync(filePath);
    } catch (error) {
      console.error("Error sharing file:", error);
      alert("An error occurred while sharing the file");
    }
  };

  const handleImport = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      console.log("result", result.assets[0].name);
      if (result.assets[0].name === "combinedData.json") {
        console.log("result", result);
        const fileContents = await FileSystem.readAsStringAsync(
          result.assets[0].uri
        );
        const importedData = JSON.parse(fileContents);

        try {
          const folderData = importedData.folderData;

          for (let i = 0; i < folderData.length; i++) {
            const folder = folderData[i];
            console.log("folder", folder);
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
            console.log("folder", folder);
            await db.execAsync(
              `INSERT INTO fileStorage (userEmail, fileName, folderName, description, hash, date) VALUES ("${folder.userEmail}", "${folder.fileName}", "${folder.folderName}", "${folder.description}", "${folder.hash}", "${folder.date}");`
            );
          }
          console.log("Data imported successfully!");
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
      <Button title="Database Data and Share" onPress={databaseData} />
      <Button title="Import" onPress={handleImport} />
      <Button title="Drop Tables" onPress={dropTables} />
    </View>
  );
}

export default ManageFiles;

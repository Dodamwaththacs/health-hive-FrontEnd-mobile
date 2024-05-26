import React, { useEffect, useState } from "react";
import {View,Text, StyleSheet,Button,Image,TextInput,TouchableOpacity,} from "react-native";
import * as SQLite from "expo-sqlite";
import * as DocumentPicker from "expo-document-picker";
import axios from 'axios';


const FileScreen = ({ route }) => {
  const [fileUri, setFileUri] = useState(null);
  const { folderId } = route.params;
  const [Description, setDescription] = useState("");
  const [FileName, setFileName] = useState("");

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    const fileUri = result.assets[0].uri;
    const fileType = result.assets[0].mimeType;
    console.log("File type:", fileType);
    if (fileType.startsWith("image/")) {
      setFileUri(fileUri);
      console.log("Image file selected:", fileUri);
    } else {
      // Handle non-image files here
      console.log("Non-image file selected:", fileType);
    }
    console.log(result);
  };


  const databaseData = async () => {
    const db = await SQLite.openDatabaseAsync("databaseName");
    const firstRow = await db.getFirstAsync(`SELECT * FROM ${folderId} `);
    console.log(firstRow.hash);
  };

  const databaseHandling = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS fileStorage (
      id INTEGER PRIMARY KEY NOT NULL,
      fileName TEXT NOT NULL,
      folderName TEXT NOT NULL,
      description TEXT NOT NULL,
      hash TEXT NOT NULL);`
    );

    db.closeAsync();
  };

  const fileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: 'file',
        type: 'image/jpeg', // Adjust the file type as needed
      });
      console.log("File log: ", fileUri);
      const response = await axios.post('http://192.168.225.140:33000/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const hash = response.data;
      console.log('File uploaded successfully:', response.data);

      const db = await SQLite.openDatabaseAsync("HealthHive");
      await db.execAsync(
        `INSERT INTO fileStorage (fileName, folderName, description, hash) VALUES ('${fileUri}', '${folderId}', '${Description}', '${hash}');`
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.head}>{folderId}</Text>
        {/* <Button onPress={() => databaseHandling()} title="Database Handling" />
        <Button onPress={() => createDatabase()} title="Create Database" />
        <Button onPress={() => databaseData()} title="Database Data" /> */}

        {!fileUri && <Button onPress={pickFile} title="Pick a file" />}
        {fileUri && (
          <View style = {styles.container_2}>
            <Image source={{ uri: fileUri }} style={{ width: "65%", height: "65%" }} />
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

        <Button onPress={databaseHandling} title="Create DB" />
        <Button onPress={databaseData} title="Drop DB" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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

});

export default FileScreen;

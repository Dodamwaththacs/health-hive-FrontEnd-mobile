import React, { useEffect, useState } from "react";
import {View,Text, StyleSheet,Button,Image,TextInput,TouchableOpacity,Alert, Modal} from "react-native";
import * as SQLite from "expo-sqlite";
import * as DocumentPicker from "expo-document-picker";
import axios from 'axios';


const FileScreen = ({ route }) => {
  const [fileUri, setFileUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { folderName } = route.params;
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
      setModalVisible(true);
    } else {
      // Handle non-image files here
      console.log("Non-image file selected:", fileType);
    }
    console.log(result);
  };


  const databaseData = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const firstRow = await db.getAllAsync(`SELECT * FROM fileStorage WHERE folderName = "${folderName}" ;`);
    console.log(firstRow);
    db.closeAsync();
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
 
  const tempDataEntry = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const insertResponce = await db.execAsync(
      `INSERT INTO fileStorage (fileName, folderName, description, hash) VALUES ('zxczxczx', 'zxczxczx', 'zcxzczxc', 'zxczcxzczx');`
    );
    console.log('Data inserted successfully:', insertResponce);
    db.closeAsync();
  }

  const fileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: 'file',
        type: 'image/jpeg', // Adjust the file type as needed
      });
      console.log("File log: ", fileUri);
      const response = await axios.post('http://192.168.51.140:33000/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const hash = response.data;
      console.log('File uploaded successfully:', response.data);

      const db = await SQLite.openDatabaseAsync("HealthHive");
      await db.execAsync(
        `INSERT INTO fileStorage (fileName, folderName, description, hash) VALUES ('${FileName}', '${folderName}', '${Description}', '${hash}');`
      );
      db.closeAsync();
      setModalVisible(false);
      Alert.alert('File uploaded successfully!');
      setFileUri(null);
      setFileName('');
      setDescription('');

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const testConnection = async () => {
    try {
      const response = await axios.get('http://192.168.51.140:33000/');
      Alert.alert('Connection Successful!');
      console.log(response.data);
    } catch (error) {
      Alert.alert('Connection Failed!');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.head}>{folderName}</Text>

        {!fileUri && <Button onPress={pickFile} title="Pick a file" />}
        <Modal animationType="slide" visible={modalVisible} >

        {fileUri && (
          <View style={styles.container_2}>
            <Image source={{ uri: fileUri }} style={{ width: "50%", height: "50%" }} />
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
        
        <Button onPress={databaseHandling} title="Create DB" />
        <Button onPress={databaseData} title="Data DB" />
        <Button onPress={tempDataEntry} title="Insert Data" />
        <Button onPress={testConnection} title="Test Connection" />
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

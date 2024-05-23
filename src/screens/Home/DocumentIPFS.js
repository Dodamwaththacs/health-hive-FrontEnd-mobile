import React from 'react';
import { Button, View, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function App() {
  const testConnection = async () => {
    try {
      const response = await axios.get('http://192.168.1.7:33000/');
      Alert.alert('Connection Successful!');
      console.log(response.data);
    } catch (error) {
      Alert.alert('Connection Failed!');
      console.error(error);
    }
  };

  const pickDocument = async () => {
    console.log("Picking document...");
    let result = await DocumentPicker.getDocumentAsync({});
    result = result.assets[0].uri;
    
    if (result.type !== 'cancel') {
      console.log("File log: ", result);
      uploadFile(result);
    }
  };

  const uploadFile = async (fileUri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: 'file',
        type: 'image/jpeg', // Adjust the file type as needed
      });
  
      const response = await axios.post('http://192.168.1.7:33000/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const ViewPhoto = ({ photo }) => {
    return (
      <View>
        <Image
          source={{ uri: photo.uri }}
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }
  
  // Usage
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick a Document" onPress={pickDocument} />
      <Button title="Test Connection" onPress={testConnection} />
    </View>
  );
}

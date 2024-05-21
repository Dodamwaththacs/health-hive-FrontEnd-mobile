import React, { useState } from 'react';
import { View, Button, Alert, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';



const FileDownloader = () => {
  const [fileUri, setFileUri] = useState(null);

  const downloadFile = async (fileName) => {
    const fileUri = FileSystem.documentDirectory + fileName;
    const url = `http://192.168.1.7:33000/file/${fileName}`;
    console.log(fileUri);

    try {
      const response = await fetch(url);
      if (response.ok) {
        const fileBlob = await response.blob();
        const base64data = await convertBlobToBase64(fileBlob);

        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setFileUri(fileUri);
        console.log('File downloaded successfully!', fileUri);
        Alert.alert('Success', 'File downloaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to download file');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while downloading the file');
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const openFile = async (fileUri) => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(fileUri);
      await Linking.openURL(contentUri);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while opening the file');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Download File" onPress={() => downloadFile('QmbdmT8JfnFmj5LCoHo6dfoVGThfAdXUWzkpxwq45HJKbx')} />
      <WebView 
      source={{ uri: "file:///data/user/0/host.exp.exponent/files/QmbdmT8JfnFmj5LCoHo6dfoVGThfAdXUWzkpxwq45HJKbx"}}
      style={{ flex: 1, margin: 20}}
      />
    </View>
  );
};

export default FileDownloader;

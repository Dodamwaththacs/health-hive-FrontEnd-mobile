import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/MaterialIcons';

function Documents() {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const createFolder = async () => {
    const directoryUri = FileSystem.documentDirectory + folderName;

    try {
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
      console.log('Folder created successfully!');
      setError(''); // Clear error on success
    } catch (e) {
      console.error('Failed to create folder:', e);
      setError('Failed to create folder'); // Display error in UI
    }
  };

  return(
    <View style={styles.container}>
      <Text>This is Documents!</Text>
      <TextInput
        placeholder="Enter folder name"
        value={folderName}
        onChangeText={setFolderName}
        style={styles.textInput}
      />
      <Button
        title="Create Folder"
        onPress={createFolder}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Icon name="folder" size={30} color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Documents;

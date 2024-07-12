import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SelectFiles = ({ route }) => {
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { user, scannedUserId, labReportSharesId, description } = route.params;

  useEffect(() => {
    fileSelect();
  }, []);

  const fileSelect = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('HealthHive');
      const response = await db.getAllAsync(
        `SELECT * FROM fileStorage WHERE userEmail = "${user.email}"`
      );
      await db.closeAsync();

      setFiles(response);
    } catch (error) {
      console.error('Error fetching files:', error.message);
    }
  };

  const handleFileSelect = (fileName) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fileName)) {
        return prevSelectedFiles.filter((file) => file !== fileName);
      } else {
        return [...prevSelectedFiles, fileName];
      }
    });
  };

  const fileUpload = async () => {
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        await axios.post(
          'http://13.202.67.81:10000/usermgtapi/api/shareFiles',
          {
            labReportShare: labReportSharesId,
            fileHash: selectedFiles[i],
            doctorId: scannedUserId,
            patientName: user.fullName,
          }
        );
      }
      Alert.alert('Success', 'Health report shared successfully.');
      navigation.navigate('Scan');
    } catch (error) {
      Alert.alert('Error', 'Failed to share health records.');
      console.error('Error sharing health report:', error.message);
    }
  };

  const handleCancel = () => {
    navigation.navigate('Scan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Files to Share</Text>
      <ScrollView style={styles.scrollView}>
        {files.map((file, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleFileSelect(file.hash)}
            style={[
              styles.fileContainer,
              selectedFiles.includes(file.hash) && styles.selectedFileContainer,
            ]}
          >
            <Text style={styles.fileName}>File Name: {file.fileName}</Text>
            <Text style={styles.fileText}>Description: {file.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={fileUpload}>
          <Text style={styles.buttonText}>Share Selected Files</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    color: '#003366',
  },
  fileContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedFileContainer: {
    backgroundColor: '#ADD8E6',
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fileText: {
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectFiles;
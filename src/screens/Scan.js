import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, TextInput, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { useEmail } from "../EmailContext";

const Scan = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanType, setScanType] = useState(null);
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannedUserId, setScannedUserId] = useState(null);
  const { email } = useEmail();

  // Function to request camera permission
  const getCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  // Request camera permission on component mount
  useEffect(() => {
    getCameraPermission();
    fetchUserData();
  }, []);

  // Fetch user data by email
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://192.168.8.106:33000/api/users/email/${email}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  // Handle the barcode scanned event
  const handleBarCodeScanned = async ({ type, data }) => {
    console.log(`Scanned: type=${type}, data=${data}`);
    setScanned(true);

    const scannedUserId = data.replace('USER_', '');
    setScannedUserId(scannedUserId);
    
    try {
      const response = await axios.get(`http://192.168.8.106:33000/api/users/${scannedUserId}`);
      const scannedUser = response.data;
      
      if (!scannedUser) {
        Alert.alert("Invalid QR", "This QR code does not belong to a valid user.");
        resetScanner();
        return;
      }

      setIsModalVisible(true);
    } catch (error) {
      console.error('Error validating user ID:', error.message);
      Alert.alert("Invalid QR", "This QR code does not belong to a valid user.");
      resetScanner();
    }
  };

  // Handle lab request
  const handleLabRequest = async () => {
    try {
      const response = await axios.post('http://192.168.8.106:33000/api/labRequests', {
        user: user.id,
        lab: scannedUserId,
        description: description,
        customerName: user.fullName 
      });
      Alert.alert("Lab Request", "Your lab request has been submitted.");
      resetScanner();
    } catch (error) {
      console.error('Error submitting lab request:', error.message);
      Alert.alert("Error", "Failed to submit lab request.");
      resetScanner();
    }
  };

  // Handle health report sharing
  const handleHealthReport = async () => {
    try {
      const response = await axios.post('http://192.168.8.106:33000/api/labReportShares', {
        doctor: scannedUserId,
        patient: user.id,
        description: description,
        patientName: user.fullName 
      });
      Alert.alert("Health Report Sharing", "Health report shared successfully.");
      resetScanner();
    } catch (error) {
      console.error('Error sharing health report:', error.message);
      console.error('Error response:', error.response.data);
      Alert.alert("Error", "Failed to share health records.");
      resetScanner();
    }
  };

  // Handle modal submit
  const handleSubmit = () => {
    setIsModalVisible(false);
    if (scanType === 'labRequest') {
      handleLabRequest();
    } else if (scanType === 'healthReport') {
      handleHealthReport();
    }
  };

  // Reset scanner state
  const resetScanner = () => {
    setScanned(false);
    setIsScannerActive(false);
    setScanType(null);
    setDescription('');
    setScannedUserId(null);
  };

  // Screen for requesting permission
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>{hasPermission === null ? 'Requesting camera permission...' : 'No access to camera'}</Text>
        <Button title="Allow Camera" onPress={getCameraPermission} />
      </View>
    );
  }

  // Main screen when permission is granted
  return (
    <View style={styles.container}>
      {isScannerActive ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.barcodebox}
          />
          <Button
            title="Cancel"
            onPress={resetScanner}
            color="tomato"
          />
        </>
      ) : (
        <>
          <Button
            title="Request Lab"
            onPress={() => { setScanType('labRequest'); setScanned(false); setIsScannerActive(true); }}
            color="green"
          />
          <Button
            title="Share Health Report"
            onPress={() => { setScanType('healthReport'); setScanned(false); setIsScannerActive(true); }}
            color="purple"
          />
        </>
      )}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter description:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setDescription}
              value={description}
            />
            <Button
              title="Submit"
              onPress={handleSubmit}
            />
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
              color="tomato"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  barcodebox: {
    height: 520,
    width: 280,
    overflow: 'hidden',
    borderRadius: 60,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  }
});

export default Scan;

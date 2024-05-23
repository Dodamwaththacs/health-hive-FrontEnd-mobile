import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { useEmail } from "../EmailContext";

const Scan = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanType, setScanType] = useState(null);
  const [user, setUser] = useState(null);
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
  const handleBarCodeScanned = ({ type, data }) => {
    console.log(`Scanned: type=${type}, data=${data}`);
    setScanned(true);

    if (scanType === 'labRequest' && !isValidLabQR(data)) {
      Alert.alert("Invalid QR", "This is not a valid QR code for a lab request.");
      resetScanner();
      return;
    } else if (scanType === 'healthReport' && !isValidHealthQR(data)) {
      Alert.alert("Invalid QR", "This is not a valid QR code for health report sharing.");
      resetScanner();
      return;
    }

    if (scanType === 'labRequest') {
      handleLabRequest(data);
    } else if (scanType === 'healthReport') {
      handleHealthReport(data);
    }
  };

  // Validate QR code data for lab request
  const isValidLabQR = (data) => {
    // Add specific validation logic for lab request QR codes here
    return data.startsWith('LAB_'); // Example: valid QR codes start with 'LAB_'
  };

  // Validate QR code data for health report sharing
  const isValidHealthQR = (data) => {
    // Add specific validation logic for health report QR codes here
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data); // Simple email validation regex
  };

  // Handle lab request
  const handleLabRequest = (data) => {
    Alert.prompt(
      "Lab Request",
      "Enter description:",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resetScanner()
        },
        {
          text: "Submit",
          onPress: async (description) => {
            const labId = data; // Extract lab ID from data
            try {
              const response = await axios.post('http://192.168.8.106:33000/api/labRequests', {
                userId: user.id,
                labId,
                description
              });
              Alert.alert("Lab Request", "Your lab request has been submitted.");
              resetScanner();
            } catch (error) {
              console.error('Error submitting lab request:', error.message);
              Alert.alert("Error", "Failed to submit lab request.");
              resetScanner();
            }
          }
        }
      ],
      "plain-text"
    );
  };

  // Handle health report sharing
  const handleHealthReport = async (data) => {
    const profileOwnerId = data; // Extract profile owner ID from data
    try {
      const response = await axios.post('http://192.168.8.106:33000/api/labReportShares', {
        viewerId: user.id,
        profileOwnerId
      });
      Alert.alert("Health Report Sharing", "Health report shared successfully.");
      resetScanner();
    } catch (error) {
      console.error('Error sharing health report:', error.message);
      Alert.alert("Error", "Failed to share health records.");
      resetScanner();
    }
  };

  // Reset scanner state
  const resetScanner = () => {
    setScanned(false);
    setIsScannerActive(false);
    setScanType(null);
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
    </View>
  );
};

export default Scan;

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
  maintext: {
    fontSize: 16,
    margin: 20,
  }
});

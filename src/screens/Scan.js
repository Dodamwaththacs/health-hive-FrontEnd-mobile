import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, TextInput, Modal, TouchableOpacity, Image } from 'react-native';
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

  const getCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    getCameraPermission();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://10.10.18.247:33000/api/users/email/${email}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log(`Scanned: type=${type}, data=${data}`);
    setScanned(true);

    const scannedUserId = data.replace('USER_', '');
    setScannedUserId(scannedUserId);
    
    try {
      const response = await axios.get(`http://10.10.18.247:33000/api/users/${scannedUserId}`);
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

  const handleLabRequest = async () => {
    try {
      const response = await axios.post('http://10.10.18.247:33000/api/labRequests', {
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

  const handleHealthReport = async () => {
    try {
      const response = await axios.post('http://10.10.18.247:33000/api/labReportShares', {
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

  const handleSubmit = () => {
    setIsModalVisible(false);
    if (scanType === 'labRequest') {
      handleLabRequest();
    } else if (scanType === 'healthReport') {
      handleHealthReport();
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setIsScannerActive(false);
    setScanType(null);
    setDescription('');
    setScannedUserId(null);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>{hasPermission === null ? 'Requesting camera permission...' : 'No access to camera'}</Text>
        <Button title="Allow Camera" onPress={getCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.guidText}>To connect with the lab, scan using "Lab Request". {"\n"}
        To share your health report with another user, scan using "Share Health Report".</Text>
        <Image
          source={require('../assets/scan.png')}
          style={styles.image}
        />
      </View>
      {isScannerActive ? (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Button
            title="Cancel"
            onPress={resetScanner}
            color="#1921E4"
            style={styles.cancelButton}
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
              <View style={styles.imageContainer}>
                <Image source={require('../assets/labrequests.png')} style={styles.buttonImage} />
              </View>
              <TouchableOpacity onPress={() => { setScanType('labRequest'); setScanned(false); setIsScannerActive(true); }}>
                <Text style={styles.buttonText}>Lab Request</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.button}>
              <View style={styles.imageContainer}>
                <Image source={require('../assets/sharereports.png')} style={styles.buttonImage} />
              </View>
              <TouchableOpacity onPress={() => { setScanType('healthReport'); setScanned(false); setIsScannerActive(true); }}>
                <Text style={styles.buttonText}>Share Health Report</Text>
              </TouchableOpacity>
          </View>
        </View>
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
              color="#1921E4"
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 150,
    alignItems: "center",
    marginBottom: 20,
    marginTop: -140,
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 106,
    height: 106,
  },
  guidText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    flex: 1,
    marginRight: 2,
    marginLeft: 10,
  },
  scannerContainer: {
    flex: 1,
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#fff',
  },
  barcodebox: {
    height: '90%',
    width: '90%',
    backgroundColor:'#fff'
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '93%',
    marginTop: 100,
  },
  button: {
    width: 180,
    height: 180,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 20,
    elevation: 5,
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonImage: {
    width: 60,
    height: 60,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
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

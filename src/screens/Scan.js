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
      const response = await axios.get(`http://192.168.151.43:33000/api/users/email/${email}`);
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
      const response = await axios.get(`http://192.168.151.43:33000/api/users/${scannedUserId}`);
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
      const response = await axios.post('http://192.168.151.43:33000/api/labRequests', {
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
      const response = await axios.post('http://192.168.151.43:33000/api/labReportShares', {
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
        <View style={styles.scannerWrapper}>
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.overlay} />
          </View>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={resetScanner}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { setScanType('labRequest'); setScanned(false); setIsScannerActive(true); }}>
            <View style={styles.buttonContent}>
              <Image source={require('../assets/labrequests.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Lab Request</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { setScanType('healthReport'); setScanned(false); setIsScannerActive(true); }}>
            <View style={styles.buttonContent}>
              <Image source={require('../assets/sharereports.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Share your{"\n"}Health Reports</Text>
            </View>
          </TouchableOpacity>
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
            <View style={styles.horizontalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 150,
    alignItems: "center",
    marginBottom: 20,
    marginTop: -150,
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
    color: "gray",
    textAlign: "left",
    flex: 1,
    marginRight: 2,
    marginLeft: 10,
  },
  scannerWrapper: {
    flex: 1,
    width: '100%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    bottom: 2,  
  },
  scannerContainer: {
    width: '75%',
    height: '82%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: -45,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 30,
  },
  button: {
    
    height: 100,
    backgroundColor: '#ADD8E6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 30,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 20,
    marginLeft: -90,
  },
  buttonText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 10,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  modalView: {
    width: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'gray',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  horizontalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  modalButton: {
    backgroundColor: '#ADD8E6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    width: '45%', // Adjust width to maintain horizontal alignment
  },
  modalButtonText: {
    color: 'gray',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#1921E4',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    width: '25%', // Adjust width to maintain horizontal alignment
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Scan;

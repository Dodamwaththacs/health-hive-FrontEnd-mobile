import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import { useEmail } from "../EmailContext";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Scan = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanType, setScanType] = useState(null);
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannedUserId, setScannedUserId] = useState(null);
  const [files, setFiles] = useState([]);
  const [isFileModalVisible, setIsFileModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [labReportSharesId, setLabReportSharesId] = useState([]);
  const [numberOfRequests, setNumberOfRequests] = useState(0);
  const [currentRequest, setCurrentRequest] = useState(1);
  const [checkupsInput, setCheckupsInput] = useState("");
  const [isCheckupsModalVisible, setIsCheckupsModalVisible] = useState(false); // State for checkups modal
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [customTest, setCustomTest] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const getCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    getCameraPermission();
    fetchUserData();
  }, []);

  const activateScanner = async (type) => {
    if (hasPermission === null) {
      // Permission hasn't been asked yet, so ask for it
      await getCameraPermission();
    }

    if (hasPermission) {
      setScanType(type);
      setScanned(false);
      setIsScannerActive(true);
    } else {
      Alert.alert(
        "Camera Permission Required",
        "Please grant camera permission to use the scanner.",
        [{ text: "OK", onPress: getCameraPermission }]
      );
    }
  };

  const fetchUserData = async () => {
    const email = await SecureStore.getItemAsync("userEmail");

    try {
      const response = await axios.get(
        `http://13.202.67.81:10000/usermgtapi/api/users/email/${email}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data: FETCHuSER", error.message);
    }
  };
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    const scannedUserId = data;
    setScannedUserId(scannedUserId);

    try {
      let response;
      if (scanType === "labRequest") {
        response = await axios.get(
          `http://13.202.67.81:10000/usermgtapi/api/labs/${scannedUserId}`
        );
        console.log("response of labreq", response.data);

        const scannedData = response.data;

        if (!scannedData) {
          Alert.alert(
            "Invalid QR",
            "This QR code does not belong to a valid lab."
          );
          resetScanner();
          return;
        }

        setIsTestModalVisible(true);
      } else if (scanType === "healthReport") {
        response = await axios.get(
          `http://13.202.67.81:10000/usermgtapi/api/users/${scannedUserId}`
        );


        const scannedData = response.data;

        if (!scannedData) {
          Alert.alert(
            "Invalid QR",
            "This QR code does not belong to a valid user."
          );
          resetScanner();
          return;
        }

        setIsModalVisible(true);
      }
    } catch (error) {
      Alert.alert(
        "Invalid QR",
        `This QR code does not belong to a valid ${
          scanType === "labRequest" ? "lab" : "user"
        }.`
      );
      resetScanner();
    }
  };


  const handleLabRequest = async () => {
    if (selectedTests.length === 0) {
      Alert.alert("No Tests Selected", "Please select at least one test.");
      return;
    }

    for (let i = 0; i < selectedTests.length; i++) {
      console.log(`Sending lab request ${i + 1} of ${selectedTests.length}`);
      try {
        await axios.post(
          "http://13.202.67.81:10000/usermgtapi/api/labRequests",
          {
            user: user.id,
            lab: scannedUserId,
            description: selectedTests[i],
            customerName: user.fullName,
          }
        );

        console.log(`Completed request ${i + 1}`);
      } catch (error) {
        console.error(
          `Error submitting lab request for ${selectedTests[i]}:`,
          error.message
        );
        Alert.alert(
          "Error",
          `Failed to submit lab request for ${selectedTests[i]}.`
        );
      }
    }

    console.log("All requests completed");
    Alert.alert("Lab Requests", "All lab requests have been submitted.");
    resetScanner();
  };

  const handleHealthReport = async () => {
    let response;
    console.log("patientName", user.fullName);
    try {
      const response = await axios.post(
        "http://13.202.67.81:10000/usermgtapi/api/labReportShares",

        {
          doctor: scannedUserId,
          patient: user.id,
          description: description,
          patientName: user.fullName,
        }
      );
      setLabReportSharesId(response.data);

      navigation.navigate('SelectFiles', {
        user,
        scannedUserId,
        labReportSharesId,
        description,
      });
      resetScanner();

    } catch (error) {
      Alert.alert("Error", "Failed to share health records.");
      resetScanner();
    }
  };

 

  
  const handleSubmit = () => {
    setIsModalVisible(false);
    if (scanType === "labRequest") {
      handleLabRequest();
    } else if (scanType === "healthReport") {
      handleHealthReport();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetScanner();
  };
  const labTests = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel (BMP)",
    "Comprehensive Metabolic Panel (CMP)",
    "Lipid Panel",
    "Liver Function Tests (LFTs)",
    "Thyroid Function Tests",
    "Hemoglobin A1c (HbA1c)",
    "Urinalysis",
    "Electrolyte Panel",
    "Coagulation Panel",
    "C-reactive Protein (CRP)",
    "Erythrocyte Sedimentation Rate (ESR)",
    "Vitamin D Test",
    "Iron Studies",
    "Cardiac Enzyme Tests",
    "Blood Gases",
    "Microbial Cultures",
    "Hormone Panels",
    "Allergy Testing",
    "Tumor Markers",
  ];

  const toggleTestSelection = (test) => {
    setSelectedTests((prevSelectedTests) =>
      prevSelectedTests.includes(test)
        ? prevSelectedTests.filter((t) => t !== test)
        : [...prevSelectedTests, test]
    );
  };

  const handleCustomTestSubmit = () => {
    if (customTest.trim()) {
      toggleTestSelection(customTest);
      setCustomTest("");
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setIsScannerActive(false);
    setScanType(null);
    setDescription("");
    setScannedUserId(null);
    setCheckupsInput("");
    setNumberOfRequests(0);
    setCurrentRequest(1);
  };

  if (hasPermission === false) {
    return <View style={styles.container}></View>;
  }

  return (
    <View style={styles.container}>
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
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.upperContent}>
            <ImageBackground
              source={require("../assets/background-QR.png")}
              style={styles.containerImage}
            />

            <View style={styles.textContent}>
              <Text style={styles.title}>Scan QR Code</Text>
              <Text style={styles.description}>
                To connect with our registered lab, scan the lab's QR code.{" "}
                {"\n"} {"\n"}To share your reports with a registered user, scan
                their QR code.
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => activateScanner("labRequest")}
            >
              <Ionicons name="flask-outline" size={24} color="#003366" />
              <Text style={styles.buttonText}>Lab Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => activateScanner("healthReport")}
            >
              <Ionicons name="share-outline" size={24} color="#003366" />
              <Text style={styles.buttonText}>
                Share your{"\n"}Health Reports
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true} // Ensure modal covers the status bar
        onRequestClose={handleCancel} // Handle the back button on Android
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter your description</Text>
            <TextInput
              style={styles.input}
              onChangeText={setDescription}
              value={description}
            />
            <View style={styles.horizontalButtons}>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSubmit}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
      visible={isTestModalVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainerTest}>
        <View style={styles.modalViewTest}>
          <Text style={styles.modalTextTest}>Select your test here</Text>
          <ScrollView style={styles.scrollViewTest}>
            {labTests.map((test, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleTestSelection(test)}
                style={styles.testContainer}
              >
                <Text style={styles.testText}>{test}</Text>
                <View style={[
                  styles.checkbox,
                  selectedTests.includes(test) && styles.checkboxSelected
                ]} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.addCustomButton}
            onPress={() => setShowCustomInput(!showCustomInput)}
          >
            <Ionicons name={showCustomInput ? "remove" : "add"} size={24} color="white" />
          </TouchableOpacity>
          {showCustomInput && (
            <>
              <TextInput
                style={styles.inputTest}
                placeholder="Enter your test name here"
                value={customTest}
                onChangeText={setCustomTest}
              />
              <TouchableOpacity
                onPress={() => {
                  handleCustomTestSubmit(customTest);
                  setCustomTest('');
                }}
                style={styles.modalButtonTest}
              >
                <Text style={styles.modalButtonTextTest}>Add Test</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.horizontalButtonsTest}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsTestModalVisible(false);
                resetScanner();
              }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleLabRequest}
            >
              <Text style={styles.modalButtonText}>OK</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    marginTop: 0,
    paddingTop: 130,
    paddingLeft: 70,
    marginLeft: 0,
  },
  description: {
    fontSize: 18,
    color: "#003366",
    textAlign: "right",
    marginBottom: 0,
    paddingRight: 30,
    marginRight: 150,
    marginTop: 0,
  },

  scannerWrapper: {
    flex: 1,
    width: "100%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#fff",
    top: 0,
    bottom: 2,
  },
  scannerContainer: {
    width: "75%",
    height: "82%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  cancelButtonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: -45,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    height: 70,
    width: 350,
    marginLeft: 0,
    marginBottom: 30,
    backgroundColor: "#ADD8E6",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    flexDirection: "row",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#003366",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: "83%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#003366",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  horizontalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10, // Adjust the height to fit the button size
  },

  cancelButton: {
    backgroundColor: "#1921E4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    width: "25%", // Adjust width to maintain horizontal alignment
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  fileContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  fileText: {
    color: "#333",
  },
  selectedFileContainer: {
    backgroundColor: "#00FFFF", // Highlight color for selected files
  },
  containerImage: {
    flex: 1,
    width: 300,
    height: 300,
    marginBottom: 100,
    marginRight: 300,
    marginTop: -50,
  },
  textContent: {
    flexDirection: "colomn",
  },
  upperContent: {
    flexDirection: "row",
    marginBottom: 80,
  },
  modalContainerTest: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalViewTest: {
    width: '90%',
    maxHeight: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'stretch',
  },
  modalTextTest: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scrollViewTest: {
    maxHeight: 300,
  },
  testContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  testText: {
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: '#003366',
  },
  addCustomButton: {
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCustomButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputTest: {
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  modalButtonTest: {
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonTextTest: {

    color: 'white',
    fontSize: 16,
  },
  horizontalButtonsTest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    
  },
  modalButtonText: {
    color: '#003366',
    fontSize: 16,
  },
});

export default Scan;

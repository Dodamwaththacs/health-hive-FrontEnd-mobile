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
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import { useEmail } from "../EmailContext";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";

const Scan = () => {
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

  const getCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    getCameraPermission();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const email = await SecureStore.getItemAsync("userEmail");

    try {
      const response = await axios.get(
        `http://192.168.3.43:33000/api/users/email/${email}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data: FETCHuSER", error.message);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log(`Scanned: type=${type}, data=${data}`);
    setScanned(true);

    const scannedUserId = data;
    setScannedUserId(scannedUserId);
    console.log("scannedUserId:", scannedUserId);

    try {
      const response = await axios.get(
        `http://192.168.3.43:33000/api/users/${scannedUserId}`
      );
      const scannedUser = response.data;

      if (!scannedUser) {
        Alert.alert(
          "Invalid QR",
          "This QR code does not belong to a valid user."
        );
        resetScanner();
        return;
      }

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error validating user ID:", error.message);
      Alert.alert(
        "Invalid QR",
        "This QR code does not belong to a valid user."
      );
      resetScanner();
    }
  };

  const handleLabRequest = async () => {
    console.log("user:", user.id);
    console.log("lab:", scannedUserId);
    console.log("description:", description);
    console.log("customerName:", user.fullName);
    try {
      const response = await axios.post(
        "http://192.168.3.43:33000/api/labRequests",

        {
          user: user.id,
          lab: scannedUserId,
          description: description,
          customerName: user.fullName,
        }
      );

      Alert.alert("Lab Request", "Your lab request has been submitted.");
      resetScanner();
    } catch (error) {
      console.error("Error submitting lab request:", error.message);
      Alert.alert("Error", "Failed to submit lab request.");
      resetScanner();
    }
  };

  const handleHealthReport = async () => {
    let response;
    try {
      const response = await axios.post(
        "http://192.168.3.43:33000/api/labReportShares",

        {
          doctor: scannedUserId,
          patient: user.id,
          description: description,
          patientName: user.fullName,
        }
      );
      console.log("response", response.data);
      setLabReportSharesId(response.data);
      fileSelect();
    } catch (error) {
      console.error("Error sharing health report:", error.message);
      console.error("Error response:", error.response.data);
      Alert.alert("Error", "Failed to share health records.");
      resetScanner();
    }
  };

  const fileSelect = async () => {
    try {
      console.log("labReportShares", labReportSharesId);
      const db = await SQLite.openDatabaseAsync("HealthHive");
      const response = await db.getAllAsync(
        `SELECT * FROM fileStorage WHERE userEmail = "${user.email}"`
      );
      await db.closeAsync();

      console.log("response", response);
      setFiles(response);
      setIsFileModalVisible(true);
    } catch (error) {
      console.error("Error fetching files:", error.message);
    }
  };

  const fileUpload = async () => {
    console.log("doctoe id", scannedUserId);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        console.log("selectedFiles", selectedFiles[i]);

        const response = await axios.post(
          "http://192.168.3.43:33000/api/shareFiles",
          {
            labReportShare: labReportSharesId,
            fileHash: selectedFiles[i],
            doctorId: scannedUserId,
          }
        );
      }
      setIsFileModalVisible(false);
      Alert.alert("Health report shared successfully.");
      resetScanner();
    } catch (error) {
      Alert.alert("Error", "Failed to share health records.");
      console.error("Error sharing health report:", error.message);
    }
  };

  const handleFileSelect = (fileName) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fileName)) {
        console.log("prevSelectedFiles", prevSelectedFiles);

        return prevSelectedFiles.filter((file) => file !== fileName);
      } else {
        console.log("prevSelectedFiles", prevSelectedFiles);
        return [...prevSelectedFiles, fileName];
      }
    });
  };

  const handleSubmit = () => {
    setIsModalVisible(false);
    if (scanType === "labRequest") {
      handleLabRequest();
    } else if (scanType === "healthReport") {
      console.log("lab report share");
      handleHealthReport();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetScanner();
  };

  const resetScanner = () => {
    setScanned(false);
    setIsScannerActive(false);
    setScanType(null);
    setDescription("");
    setScannedUserId(null);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>
          {hasPermission === null
            ? "Requesting camera permission..."
            : "No access to camera"}
        </Text>
        <Button title="Allow Camera" onPress={getCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/background.png")} style={styles.backgroundImage} />
      <View style={styles.overlayContainer}>
        <Text style={styles.titleText}>Scan QR Code</Text>
        <Text style={styles.descriptionText}>
          Scan the QR code of the laboratory to request your lab test, or if you want to share your report with another user, scan their QR code.
        </Text>
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
                onPress={resetScanner}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setScanType("labRequest");
                setScanned(false);
                setIsScannerActive(true);
              }}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={require("../assets/labrequests.png")}
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText}>Lab Request</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setScanType("healthReport");
                setScanned(false);
                setIsScannerActive(true);
              }}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={require("../assets/sharereports.png")}
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText}>
                  Share your{"\n"}Health Reports
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Description</Text>
              <TextInput
                style={styles.modalInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
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
          visible={isFileModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Files to Share</Text>
              {files.map((file) => (
                <TouchableOpacity
                  key={file.id}
                  style={[
                    styles.fileItem,
                    selectedFiles.includes(file.fileName) &&
                      styles.fileItemSelected,
                  ]}
                  onPress={() => handleFileSelect(file.fileName)}
                >
                  <Text style={styles.fileItemText}>{file.fileName}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setIsFileModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={fileUpload}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1921E4",
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,
  },
  scannerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerContainer: {
    width: "100%",
    height: "50%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 2,
    borderRadius: 16,
  },
  cancelButtonContainer: {
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#1921E4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  buttonImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#1921E4",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  fileItem: {
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginBottom: 10,
  },
  fileItemSelected: {
    backgroundColor: "#D0D0D0",
  },
  fileItemText: {
    fontSize: 16,
  },
});

export default Scan;

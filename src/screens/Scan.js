import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const Scan = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('Not yet scanned');
  const [isScannerActive, setIsScannerActive] = useState(false); // New state for activating the scanner

  // Function to request camera permission
  const getCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  // Request camera permission on component mount
  useEffect(() => {
    getCameraPermission();
  }, []);

  // Handle the barcode scanned event
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(`Bar code with type ${type} and data ${data} has been scanned!`);
    setIsScannerActive(false); // Turn off scanner after scanning
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
      {isScannerActive && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barcodebox}
        />
      )}
      <Text style={styles.maintext}>{data}</Text>
      {scanned && (
        <Button title="Scan again?" onPress={() => { setScanned(false); setIsScannerActive(true); }} color="tomato" />
      )}
      <Button
        title={isScannerActive ? "Turn off camera" : "Open camera"}
        onPress={() => setIsScannerActive(!isScannerActive)}
        color="blue"
      />
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

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from '@react-navigation/native';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
      setIsScanning(false);
      requestCameraPermission();
    }, [])
  );

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.scanButtonText}>Request Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsScanning(false);
    Alert.alert("Barcode Found!", `Type: ${type}\nData: ${data}`);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={isScanning && !scanned ? handleBarCodeScanned : undefined}
        style={StyleSheet.absoluteFillObject}
      />
      {!isScanning && (
        <TouchableOpacity style={styles.button} onPress={() => setIsScanning(true)}>
          <Text style={styles.scanButtonText}>Tap to Scan</Text>
        </TouchableOpacity>
      )}
      {scanned && (
        <TouchableOpacity style={styles.button} onPress={() => {
          setScanned(false);
          setIsScanning(true);
        }}>
          <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 300,
    marginTop: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QR_Code = () => {
  const text = "bhaya";
  return (
    <View style={styles.qrContainer}>
      {/* Set the size of the QR code here */}
      <QRCode value={text} size={300} />
    </View>
  );
};
export default QR_Code;

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
});

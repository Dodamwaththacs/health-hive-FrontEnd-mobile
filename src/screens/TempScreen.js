import { Text, View, StyleSheet } from "react-native";
import React from "react";
import PDF from "react-native-pdf";

export default function App() {
  const PdfResource = {
    uri: "https://picsum.photos/200/300",
    cache: true,
  };

  return (
    <View style={styles.container}>
      <PDF
        trustAllCerts={false}
        source={PdfResource}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: "100%",
  },
});

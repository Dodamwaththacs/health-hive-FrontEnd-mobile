import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import QRCode from 'react-native-qrcode-svg';

const QR_Code = ({ route }) => {
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.guidText}>Give your QR code to someone if they want to share their medical records with you.</Text>
        <Image
          source={require('../assets/scanHere.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.card}>

      
        <View style={styles.qrContainer}>
          {userId && (
            <QRCode
              value={userId.toString()}
              size={235}
              color="black"
              backgroundColor="white"
            />
          )}
        </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    paddingTop: 20, // Adjust as needed for spacing
    marginTop: -25,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 110,
    alignItems: "center",
    marginBottom: 20,
    marginTop:70,
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 } ,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5, // Adjust as needed
  },
  image: {
    width: 100, // Adjust size to fit well with the text
    height: 100,
  },
  card: {
    marginTop: 90,
    width: "73%",
    height: 300,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    padding: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 20,
  },
  guidText: {
    fontSize: 16,
    color: "gray",
    textAlign: "left",
    flex: 1,
    marginRight: 5, // Add space between text and image
    marginLeft :10,
  },

  qrContainer: {
    paddingTop: 25,
  }
});

export default QR_Code;

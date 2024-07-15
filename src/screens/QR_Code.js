import React from "react";
import { View, Text, StyleSheet, Image,ImageBackground } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QR_Code = ({ route }) => {
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <View style={styles.upperContent}>
      
          <View style={styles.textContent}>
        <Text style={styles.title}>Scan Me</Text>
        <Text style={styles.guidText}>
          Give your QR code {'\n'} to someone {'\n'}if they want to{'\n'} share their medical
          records{'\n'}with you.
        </Text>
        </View>
        <ImageBackground
            source={require("../assets/background-QR.png")}
            style={styles.containerImage}
          />
      </View>
      </View>
      <View style={styles.container1}>
      <View style={styles.card}>
        <View style={styles.qrContainer}>
          {userId && (
            <QRCode
              value={userId.toString()}
              size={235}
              color="#0056B3"
              backgroundColor="white"
            />
          )}
        </View>
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
    backgroundColor: "#FFF",
    paddingTop: 20, // Adjust as needed for spacing
    marginTop: -25,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom:0,
    marginBottom:0,
   
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    marginTop: 0,
    paddingTop: 0,
    paddingLeft: 30,
    marginLeft: 0,
  },
  containerImage: {
    flex: 1,
    width: 280,
    height: 280,
   marginBottom:0,
    paddingRight:30,
    marginTop:30,
  },
  upperContent:{
    flexDirection:"row",
    
   },
   guidText: {
    fontSize: 18
    ,
    color: "#003366",
    textAlign: "left",
    marginBottom: 0,
    paddingLeft:30,
    marginRight:0,
    marginTop: 0,
  },
  textContent:{
    flexDirection:"colomn",
    paddingTop:180,
  },
 
  card: {
    marginTop: 0,
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
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 20,
  },
 

  qrContainer: {
    paddingTop: 25,
    paddingHorizontal: 25,
    
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical:110, // Adjust as needed for spacing
  },
  
});

export default QR_Code;

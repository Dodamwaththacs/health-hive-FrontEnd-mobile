import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const About = () => {
  return (
    <ScrollView style={styles.container}>


      <View style={styles.imageContainer}>
        <Image source={require("../assets/logo.png")} style={styles.officeImage} />
     
      <Text style={styles.title1}>HealthHive</Text>
      <Text style={styles.subtitle1}>Health Passport System</Text>
      </View>

      <Text style={styles.modalTagline}>
        We provide the best designed health documents management app for our clients by maximizing innovation.
      </Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rating: </Text>
        <Ionicons name="star" size={20} color="#FFD700" />
        <Text style={styles.ratingScore}>5.0</Text>
      </View>

      <Text style={styles.modalText}>
        Join a team who works as hard as you do and takes your health documents management to the next level.
      </Text>

      <Text style={styles.modalSubtitle}>Our Mission</Text>
      <Text style={styles.modalText}>
        We help people manage your health information securely and efficiently.
      </Text>

      <Image source={require("../assets/healthcare.jpg")} style={styles.teamImage} />

      <Text style={styles.modalSubtitle}>Key Features</Text>
      <Text style={styles.modalText1}>
        • Secure storage for medical documents{"\n"}
        • Direct lab results delivery {"\n"}
        • Share medical details securely {"\n"}
        • Health tips & news updates {"\n"}
      </Text>

      <View style={styles.socialMediaContainer}>
        <TouchableOpacity style={styles.socialIcon}>
          <Ionicons name="logo-facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Ionicons name="logo-instagram" size={24} color="#c13584" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },

  modalTagline: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomColor: '#E4E9F2',
    borderBottomWidth: 2,
    
  },
  ratingText: {
    fontSize: 16,
    color: 'gray',
    
  },
  ratingScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: 'gray',
    
  },
  imageContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  officeImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: -20,
  },
  teamImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
  modalSubtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#003366',
    textAlign: 'center',
    paddingTop: 20,
    borderTopColor: '#E4E9F2',
    borderTopWidth: 2,
    
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    lineHeight: 26,
    textAlign: 'center',
    color: 'gray',
  },
  modalText1: {
    fontSize: 18,
    marginBottom: 10,
    lineHeight: 26,
    textAlign: 'center',
    paddingBottom: 20,
    borderBottomColor: '#E4E9F2',
    borderBottomWidth: 2,
    color: 'gray',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  socialIcon: {
    marginHorizontal: 10,
    marginTop: -10,
    marginBottom: 10,
  },
  title1: {
    fontSize: 25, 
    fontWeight: 'bold',
    color: '#003366', 
    marginBottom: -4, 
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle1: {
    fontSize: 16, 
    color: '#003366', 
    marginBottom: 10,
    paddingBottom: -20,
    textAlign: 'center',
  },
});

export default About;
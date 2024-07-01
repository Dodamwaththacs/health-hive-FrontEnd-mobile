import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image } from "react-native";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Setting = () => {
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);

  const handleResetPassword = () => {
    const url = "https://lemur-6.cloud-iam.com/auth/realms/teamnova/account/#/account-security/signing-in";
    Linking.openURL(url);
  };

  const handleHelpAndSupport = () => {
    // Add logic for Help and Support
  };

  const handleAbout = () => {
    setIsAboutModalVisible(true);
  };

  const renderOption = (title, iconName, onPress) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.leftContent}>
        <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#888" />
    </TouchableOpacity>
  );

  const AboutModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isAboutModalVisible}
      onRequestClose={() => setIsAboutModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsAboutModalVisible(false)}>
            <Ionicons name="close-circle" size={30} color="#0056B3" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>About Us</Text>

          <View style={styles.imageContainer}>
            <Image source={require("../assets/logo.png")} style={styles.officeImage} />
          </View>
          <Text style={styles.title1}>HealthHive</Text>
          <Text style={styles.subtitle1}>Health Passport System</Text>

          <Text style={styles.modalTagline}>
            We provide the best designed health management app for our clients by maximizing innovation.
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Rating: </Text>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingScore}>5.0</Text>
          </View>

          <Text style={styles.modalText}>
            Join a team who works as hard as you do and takes your health management to the next level.
          </Text>

          <Text style={styles.modalSubtitle}>Our Mission</Text>
          <Text style={styles.modalText}>
            We help people manage your health information securely and efficiently.
          </Text>

          <Image source={require("../assets/healthcare.jpg")} style={styles.teamImage} />

          <Text style={styles.modalSubtitle}>Key Features</Text>
          <Text style={styles.modalText}>
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
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderOption("Reset Your Password", "key-outline", handleResetPassword)}
      {renderOption("Help and Support", "help-circle-outline", handleHelpAndSupport)}
      {renderOption("About", "information-circle-outline", handleAbout)}
      <AboutModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '90%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
  },
  ratingScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  officeImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginLeft: 130,
    marginBottom: -20,
  },
  teamImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#003366',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 26,
    textAlign: 'center',
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
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#003366', 
    marginBottom: -4, 
    marginLeft: 110,
  },
  subtitle1: {
    fontSize: 14, 
    color: '#003366', 
    marginBottom: 20, 
    marginLeft: 85,
  },
});

export default Setting;

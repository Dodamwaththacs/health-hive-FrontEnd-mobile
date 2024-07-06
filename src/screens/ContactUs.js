import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ContactUs = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const sendEmail = () => {
    Linking.openURL('mailto:support@healthhive.com').catch((err) => console.error("Couldn't send email", err));
  };

  const callPhoneNumber = () => {
    Linking.openURL('tel:+1234567890').catch((err) => console.error("Couldn't make call", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Contact Us</Text>
        <Text style={styles.description}>If you have any questions or need further assistance, feel free to contact us through the following...</Text>
        
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => openLink('https://facebook.com/HealthHive')} style={styles.socialMediaButton}>
            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
            <Text style={styles.socialMediaText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://twitter.com/HealthHive')} style={styles.socialMediaButton}>
            <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
            <Text style={styles.socialMediaText}>Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://instagram.com/HealthHive')} style={styles.socialMediaButton}>
            <Ionicons name="logo-instagram" size={28} color="#E4405F" />
            <Text style={styles.socialMediaText}>Instagram</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={sendEmail} style={styles.contactButton}>
          <Ionicons name="mail" size={24} color="#FFFFFF" />
          <Text style={styles.contactText}>support@healthhive.com</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={callPhoneNumber} style={styles.contactButton}>
          <Ionicons name="call" size={24} color="#FFFFFF" />
          <Text style={styles.contactText}>+1 (234) 567-890</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0056B3',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
    lineHeight: 24,
    color: 'gray',
    textAlign: 'center',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  socialMediaButton: {
    alignItems: 'center',
    padding: 12,
  },
  socialMediaText: {
    fontSize: 16,
    color: '#0056B3',
    marginTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056B3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default ContactUs;
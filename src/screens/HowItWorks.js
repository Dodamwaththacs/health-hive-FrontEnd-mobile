import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Section = ({ title, content, iconName }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={iconName} size={24} color="#0056B3" style={styles.icon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const HowItWorks = () => {
  const sections = [
    {
      title: "1. Registration",
      content: "Visit a Health Hive customer registrar at a nearby government hospital to register as a user. You'll receive an email from our team with login instructions.",
      iconName: "person-add"
    },
    {
      title: "2. App Download & Login",
      content: "Download our app and log in using the credentials provided in the email.",
      iconName: "phone-portrait"
    },
    {
      title: "3. Document Management",
      content: "Upload your past medical records by creating custom folders in the 'Documents' section. Organize your health history efficiently.",
      iconName: "document-text"
    },
    {
      title: "4. Secure Sharing",
      content: "Share your health reports with other app users (e.g., doctors, specialists, family) by scanning their QR code. Shared files are automatically deleted after the specified time for enhanced privacy.",
      iconName: "share"
    },
    {
      title: "5. Direct Lab Integration",
      content: "Receive health reports directly from registered labs by scanning their QR code during your visit.",
      iconName: "flask"
    },
    {
      title: "6. Health Tracking",
      content: "Monitor your weight, calculate BMI, and receive personalized weight management instructions.",
      iconName: "fitness"
    },
    {
      title: "7. Health News & Tips",
      content: "Stay informed with the latest health news and tips delivered right to your app.",
      iconName: "newspaper"
    },
    {
      title: "Why Choose Health Hive?",
      content: "Our blockchain-based system ensures secure storage, easy accessibility, and complete control over your medical records. Say goodbye to vulnerable traditional systems and embrace a transparent, tamper-resistant solution for managing your health information.",
      iconName: "shield-checkmark"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
       
        <Text style={styles.header}>How Health Hive Works</Text>
      </View>
      {sections.map((section, index) => (
        <Section key={index} title={section.title} content={section.content} iconName={section.iconName} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056B3',
    marginLeft: 10,
    textAlign: 'center',
  },
  section: {
  
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056B3',
  },
  sectionContent: {
    fontSize: 16,
    color: 'gray',
    lineHeight: 24,
  },
});

export default HowItWorks;
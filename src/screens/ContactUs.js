import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      await axios.post('https://your-api-url/api/contact', {
        name,
        email,
        question,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const sendEmail = () => {
    Linking.openURL('mailto:support@healthhive.com').catch((err) => console.error("Couldn't send email", err));
  };

  if (submitted) {
    return (
      <View style={styles.confirmationContainer}>
        <Text style={styles.confirmationText}>Thank you for your question! We'll get back to you within 24 hours.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Contact Us</Text>
      <Text style={styles.description}>If you have any questions or need further assistance, feel free to contact us through the following channels:</Text>
      
      <View style={styles.socialMediaContainer}>
        <TouchableOpacity onPress={() => openLink('https://facebook.com/HealthHive')} style={styles.socialMediaButton}>
          <Ionicons name="logo-facebook" size={24} color="#0056B3" />
          <Text style={styles.socialMediaText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://twitter.com/HealthHive')} style={styles.socialMediaButton}>
          <Ionicons name="logo-twitter" size={24} color="#0056B3" />
          <Text style={styles.socialMediaText}>Twitter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://instagram.com/HealthHive')} style={styles.socialMediaButton}>
          <Ionicons name="logo-instagram" size={24} color="#0056B3" />
          <Text style={styles.socialMediaText}>Instagram</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={sendEmail} style={styles.contactButton}>
        <Ionicons name="mail" size={24} color="#0056B3" />
        <Text style={styles.contactText}>support@healthhive.com</Text>
      </TouchableOpacity>

      <Text style={styles.formHeader}>Ask Us a Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your Question"
        value={question}
        onChangeText={setQuestion}
        multiline
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationText: {
    fontSize: 18,
    color: '#0056B3',
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056B3',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialMediaText: {
    fontSize: 16,
    color: '#0056B3',
    marginLeft: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 16,
    color: '#0056B3',
    marginLeft: 8,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0056B3',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#0056B3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactUs;

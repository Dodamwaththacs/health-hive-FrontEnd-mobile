import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const Help = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How can we help you ?</Text>

      <Text style={styles.instructionText}>How it Works: Learn about our service process</Text>
        <Text style={styles.instructionText}>FAQ: Find answers to common questions</Text>
        <Text style={styles.instructionText}>Contact Us: Get in touch with our support team</Text>
      
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('HowItWorks')}
        >
          <Ionicons name="information-circle-outline" size={40} color="white" />
          <Text style={styles.buttonText}>How it Works</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('FAQ')}
        >
          <Ionicons name="help-circle-outline" size={40} color="white" />
          <Text style={styles.buttonText}>FAQ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ContactUs')}
        >
          <Ionicons name="call-outline" size={40} color="white" />
          <Text style={styles.buttonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#0056B3',
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: 50,
    },
    button: {
      width: '40%',
        height: 100,
      backgroundColor: '#0056B3',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginBottom: 30,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 18,
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        color: 'gray',
      },
  });

export default Help;
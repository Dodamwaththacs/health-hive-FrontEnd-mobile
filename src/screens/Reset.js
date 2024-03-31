import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Make sure to install @react-navigation/native

const Reset = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const navigation = useNavigation();




  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text>＜</Text> {}
      </TouchableOpacity> */}
      <Text style={styles.title}>Reset Your Password</Text>
      <Image source={require('../assets/password-reset-icon.png')} style={styles.icon} />
      <Text style={styles.warning}>Please enter valid e-mail/ phone number</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmailOrPhone}
        value={emailOrPhone}
        placeholder="Email/Phone No"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDot} />
        <View style={styles.paginationDotInactive} />
        <View style={styles.paginationDotInactive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    // Add styles for your back button here
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
  },
  icon: {
    // Add styles for your icon here
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  warning: {
    // Add styles for your warning text here
    color: 'red',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    paddingVertical: 10,
    backgroundColor: '#0000ff',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#0000ff',
    marginHorizontal: 5,
  },
  paginationDotInactive: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
});

export default Reset;

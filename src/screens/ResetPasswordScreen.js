import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    // Add your password reset logic here
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Reset Your Password</Text>
      <View style={styles.lockIconCircle}>
      <Image source={require('../assets/password-reset-icon.png')} style={styles.icon} />
      </View>
      <Text style={styles.instruction}>Password should contain at least 8 characters</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="New Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm new password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.resetButton} onPress={()=>navigation.navigate('LoadingScreen')}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>
      <View style={styles.indicatorContainer}>
        {/* Add indicator dots here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  lockIconCircle: {
    // Style for the lock icon circle
  },
  instruction: {
    color: 'red',
    // Add more styles for instruction text
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    // Add more styles for input fields
  },
  resetButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  indicatorContainer: {
    // Style for the indicator dots container
  },
  icon: {
    // Add styles for your icon here
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginVertical: 20,
  },
});

export default ResetPasswordScreen;
